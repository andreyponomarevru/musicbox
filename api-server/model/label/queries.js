const logger = require("../../utility/loggerConf.js");
const { connectDB } = require("../postgres.js");

async function readAll() {
  const pool = await connectDB();
  try {
    const readLabelsText = "SELECT * FROM label WHERE name IS NOT null";
    const labels = (await pool.query(readLabelsText)).rows;
    return { labels };
  } catch (err) {
    logger.error(`Can't read label names: ${err.stack}`);
  }
}

module.exports.readAll = readAll;
