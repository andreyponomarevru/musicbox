/*
// superagent - Small progressive client-side HTTP request library, and Node.js 
// module with the same API, supporting many high-level HTTP client features
//https://www.npmjs.com/package/superagent 
import request from 'superagent';

import util from 'util';
import url from 'url';
const URL = url.URL;
import DBG from 'debug';
const debug = DBG('notes:users-superagent');
const error = DBG('notes:error-superagent');

// The reqURL function replaces the connectXYZZY functions that we wrote in
//earlier modules. With superagent, we don't leave a connection open to
//the service, but open a new connection on each request. The
//common thing to do is to formulate the request URL. The user is
//expected to provide a base URL, such as http://localhost:3333/, in the
//USER_SERVICE_URL environment variable. This function modifies that
//URL, using the new WHATWG URL support in Node.js, to use a
//given URL path
function reqURL(path) {
  const requrl = new URL(process.env.USER_SERVICE_URL);
  requrl.pathname = path;
  return requrl.toString();
}

export async function create(username, password, provider, familyName, givenName, middleName, emails, photos) {
  const res = await request
    .post(reqURL('/create-user'))
    .send({
      username, password, provider, familyName, givenName, middleName, emails, photos
    })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .auth('them', '')

  return res.body;
}

export async function update(username, password, provider, familyName, givenName, middleName, emails, photos) {
  const res = await request
    .post(reqURL(`/update-user/${username}`))
    .send({
      username, password, provider, familyName, givenName, middleName, emails, photos
    })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
  
  return res.body;
}

export async function find(username) {
  const res = await request
    .get(reqURL(`/find/${username}`))
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');

  return res;
}

// We're sending the request to check passwords to the server.
export async function userPasswordCheck(username, password) {
  try {
    debug(`userPasswordCheck(${username}, ${password})`);
    const res = await request
      .post(reqURL('/passwordCheck'))
      .send({ username, password })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF')
    return res.body;
  } catch (err) {
    error(`users userPasswordCheck ERROR ${err.stack}`);
    throw err;
  }
  

}

// The findOrCreate function either discovers the user in the database, or
// creates a new user. 

// The profile object will come from Passport, but
//take careful note of what we do with profile.id. The Passport
//documentation says it will provide the username in the profile.id
//field. But we want to store it as username, instead

export async function findOrCreate(profile) {
  const res = request
    .post(reqURL('/find-or-create'))
    .send({
      username: profile.id,
      password: profile.password,
      provider: profile.provider,
      familyName: profile.familyName,
      givenName: profile.givenName,
      middleName: profile.middleName,
      emails: profile.emails,
      photos: profile.photos
    })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');

  return res.body;
}

export async function listUsers() {
  const res = request
    .get(reqURL('/list'))
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');

  return res.body;
}
*/
