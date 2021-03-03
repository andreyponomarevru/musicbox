import pg from 'pg';
import jsyaml from 'js-yaml';
import fs from 'fs-extra';
import util, { isError } from 'util';
import DBG from 'debug';
const log = DBG('users:model-users');
const error = DBG('users:error');

let pool;

console.log("process.env.POSTGRESQL_CONNECT: ", process.env.POSTGRESQL_CONNECT)

async function connectDB() {
  if (pool) return pool;
  
  const YAML = await fs.readFile(process.env.POSTGRESQL_CONNECT, 'utf8');
  const { user, host, password, database, port } = jsyaml.safeLoad(YAML, 'utf8');

  /* Open the database connection. The parameters obviously contain any needed database name, username, password, and other options required to connect with the database */
  if (!pool) pool = new pg.Pool({ user, host, password, database, port });

  /* 
  These fields largely come from the Passport / Portable Contacts schema. 
  See http://www.passportjs.org/docs/profile
  
  The emails and photos fields are arrays in Portable Contacts.
  We'd need to set up additional tables for those.

  The Portable Contacts "id" field maps to the "username" field here
  */

  await pool.query(
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE, password VARCHAR(255), provider VARCHAR(255), familyName VARCHAR(255), givenName VARCHAR(255), middlename VARCHAR(255), emails VARCHAR(2048), photos VARCHAR(2048))"
  );

  return pool;
}

/* Our create and update functions take user information and either add a
new record or update an existing record: */

export async function create(username, password, provider, familyName, givenName, middleName, emails, photos) {
  const pool = await connectDB();
  
  const queryText = 'INSERT INTO users (username, password, provider, familyName, givenName, middleName, emails, photos) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
  
  const { rows } = await pool.query(
    queryText, [ username, password, provider, familyName, givenName, middleName, JSON.stringify(emails), JSON.stringify(photos) ] 
  );

  return rows[0];
}

export async function update(username, password, provider, familyName, givenName, middleName, emails, photos) {
  // I HADN'T TESTED THIS FUNCTION, MAYBE IT DOESN'T WORK
  // I wrote this function 100% by myself, so maybe some things here should be reconsidered...
  
  const user = await find(username);
  const pool = await connectDB();

  if (user) {
    const queryText = 'UPDATE users SET username=$1, password=$2, provider=$3, familyName=$4, givenName=$5, middleName=$6, emails=$7, photos=$8 WHERE id=$9 RETURNING *';
    const { rows } = await pool.query(queryText, [ username, password, provider, familyName, givenName, middleName, JSON.stringify(emails), JSON.stringify(photos), user.id ]);
    return rows[0];
  } else return undefined;
}

/* This lets us look up a user information record, and we return a
sanitized version of that data. */
export async function find(username) {
  log(`find ${username}`);
  const pool = await connectDB();
  const queryText = 'SELECT * FROM users WHERE username=$1';
  const { rows } = await pool.query(queryText, [username]);

  /* Because we're segregating the user data from the rest of the Notes
application, we want to return a sanitized object rather than the
actual user object aka row[0]. What if there was some information leakage
because we simply sent the user object (row[0]) directly back to the caller? The
sanitizedUser function, shown later, creates an anonymous object with
!!! exactly the fields we want exposed to the other modules!!! For example, we removed 'password' property from this object cause we don't want to reveal it:
*/

  return rows[0] ? sanitizedUser(rows[0]) : undefined;
}


export async function destroy(username) {
  // I HADN'T TESTED THIS FUNCTION, MAYBE IT DOESN'T WORK
  // I wrote this function 100% by myself, so maybe some things here should be reconsidered...
  const user = await find(username);
  if (!user) throw new Error(`Did not find requested ${username} to delete`);

  const pool = await connectDB();
  const queryText = 'DELETE FROM users WHERE username=$1';
  await pool.query(queryText, [username]);
}

/* This lets us support the checking of user passwords. The three
conditions to handle are as follows: */
export async function userPasswordCheck(username, password) {
  // I HADN'T TESTED THIS FUNCTION, MAYBE IT DOESN'T WORK
  // I wrote this function 100% by myself, so maybe some things here should be reconsidered...

  const pool = await connectDB();
  const queryText = 'SELECT * FROM users WHERE username=$1';
  const { rows } = await pool.query(queryText, [username]);

  // Whether there's no such user
  if (!rows[0]) {
    return { check: false, username, message: "Could not find user" };
  // Whether the passwords matched
  } else if (rows[0].username === username && rows[0].password === password) {
    return { check: true, user: rows[0].username };
  // Whether they did not match
  } else {
    return { check: false, username, message: "Incorrect password" };
  }

  /* The object we return above lets the caller distinguish between those cases.
The check field indicates whether to allow this user to be logged in. If
check is false, there's some reason to deny their request to log in, and
the message is what should be displayed to the user: */
}

/* This combines two actions in one function: first, to verify whether
the named user exists and, if not, to create that user. Primarily, this
will be used while authenticating against third-party services: */
export async function findOrCreate(profile) {
  // I HADN'T TESTED THIS FUNCTION, MAYBE IT DOESN'T WORK
  // I wrote this function 100% by myself, so maybe some things here should be reconsidered...

  const user = await find(profile.id);
  if (user) return user;

  return await create(profile.id, profile.password, profile.provider, profile.familyName, profile.givenName, profile.middleName, profile.emails, profile.photos);
}

/* List the existing users. The first step is to retrieve all users. Then we sanitize that list so
we don't expose any data that we don't want exposed: */
export async function listUsers() {
  // I HADN'T TESTED THIS FUNCTION, MAYBE IT DOESN'T WORK
  // I wrote this function 100% by myself, so maybe some things here should be reconsidered...

  const pool = await connectDB();
  const queryText = 'SELECT * FROM users';
  const { rows } = await pool.query(queryText);
  return rows.map(user => sanitizedUser(user));
}

/* This is our utility function to ensure we expose a carefully
controlled set of information to the caller. With this service, we're
emulating a secured user information service that's walled off from
other applications. As we said earlier, this function returns an
anonymous sanitized object where we know exactly what's in the
object. */
export function sanitizedUser(user) {
  const ret = {
    id: user.id,
    username: user.username,
    provider: user.provider,
    familyName: user.familyname,
    givenName: user.givenname,
    middleName: user.middlename,
    emails: JSON.parse(user.emails),
    photos: JSON.parse(user.photos)
  };


  /* It's very important to decode the JSON string we put into the
database. Remember that we stored the emails and photos data using
JSON.stringify in the database (check 'create' function in code above). 
Using JSON.parse, we decode those values, just like adding hot water to instant coffee produces a drinkable beverage */

  try { ret.emails = JSON.parse(user.emails); } 
  catch (e) { ret.emails = []; }

  try { ret.photos = JSON.parse(user.photos) }
  catch (e) { ret.photos = []; }

  return ret;  
}  

