const pg = require("pg");
const logger = require("../../utility/loggerConf.js");
const Track = require("./TrackModel.js");
const validate = require("./validate.js");

let pool;

async function connectDB() {
  if (pool) {
    //logger.info("Existing pool used");
    return pool;
  } else {
    pool = new pg.Pool();
    //logger.info("New pool created");
    return pool;
  }
}

async function create(metadata) {
  const pool = await connectDB();
  /*
  //const validatedData = await validate(metadata);
  const track = new Track(validatedData);
  const {
    file_path,
    extension,
    artist,
    duration,
    bitrate,
    year,
    track_no,
    title,
    album,
    disk_no,
    label,
    genre,
    bpm,
  } = track;
  logger.debug("postgres.js:");
  logger.debug(track);
*/

  //await pool.query("INSERT INTO artist (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING artist_id", [ artist ]);
  // logger.debug(`postgres.js - create():${track}`);
  //return track;
}

async function update(location) {}
async function find(location) {}
async function read(location) {}
async function readAll(location) {
  /* with paging */
}
async function destroy(location) {}

module.exports.create = create;
