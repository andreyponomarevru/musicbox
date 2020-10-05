const logger = require("../../utility/loggerConf.js");
const { connectDB } = require("../postgres.js");

async function readAll() {
  const pool = await connectDB();
  try {
    const readGenresText = "SELECT * FROM genre WHERE name IS NOT null";
    const genres = (await pool.query(readGenresText)).rows;
    return { genres };
  } catch (err) {
    logger.error(`Can't read genre names: ${err.stack}`);
  }
}

module.exports.readAll = readAll;
