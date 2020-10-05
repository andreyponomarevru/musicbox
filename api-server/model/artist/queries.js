const logger = require("../../utility/loggerConf.js");
const { connectDB } = require("../postgres.js");

async function readAll() {
  const pool = await connectDB();
  try {
    const readArtistsText = "SELECT * FROM artist WHERE name IS NOT null";
    const artists = (await pool.query(readArtistsText)).rows;
    return { artists };
  } catch (err) {
    logger.error(`Can't read artists names: ${err.stack}`);
  }
}

module.exports.readAll = readAll;
