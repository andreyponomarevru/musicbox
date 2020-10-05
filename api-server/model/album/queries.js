const logger = require("../../utility/loggerConf.js");
const { connectDB } = require("../postgres.js");

async function readAll() {
  const pool = await connectDB();
  try {
    const readAlbumsText =
      "SELECT DISTINCT ON (album) album, track_id FROM track ORDER BY album";
    const albums = (await pool.query(readAlbumsText)).rows;
    return { albums };
  } catch (err) {
    logger.error(`Can't read album names: ${err.stack}`);
  }
}

module.exports.readAll = readAll;
