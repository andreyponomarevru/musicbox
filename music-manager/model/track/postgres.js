const pg = require("pg");
const logger = require("../../utility/loggerConf.js");
const Track = require("./TrackModel.js");
const validate = require("./validate.js");
const util = require("util");

const {
  POSTGRES_USER: user,
  POSTGRES_PASSWORD: host,
  POSTGRES_HOST: database,
  POSTGRES_DATABASE: password,
  POSTGRES_PORT: port,
} = process.env;
let pool;

async function connectDB() {
  if (pool) {
    return pool;
  } else {
    pool = new pg.Pool({ user, host, database, password, port });
    return pool;
  }
}

async function create(metadata) {
  const pool = await connectDB();
  const client = await pool.connect();
  console.log(pool, "!!!!!!!!!!!");
  try {
    //const validatedData = await validate(metadata);
    //const track = new Track(validatedData);

    console.log("!");
    await client.query("BEGIN");
    const queryText =
      "WITH \
        input_rows (name) AS ( \
          VALUES ($1) \
        ), \
        \
        ins AS ( \
          INSERT INTO artist (name) \
          SELECT name FROM input_rows \
          ON CONFLICT DO NOTHING \
          RETURNING artist_id \
        ) \
        \
      SELECT artist_id FROM ins \
      \
      UNION ALL \
      \
      SELECT a.artist_id FROM input_rows \
        JOIN artist AS a \
       USING (name);";

    const { artist_id } = (
      await client.query(queryText, [track.artist])
    ).rows[0];
    console.dir(artist_id);

    await client.query("COMMIT");
    return track;
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(err);
    throw err;
  } finally {
    client.release();
  }
}

async function update(location) {}
async function find(location) {}
async function read(location) {}
async function readAll(location) {
  /* with paging */
}
async function destroy(location) {}

module.exports.create = create;
