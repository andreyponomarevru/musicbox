const logger = require("../../utility/loggerConf.js");
const { connectDB } = require("../postgres.js");

async function readAll() {
  const pool = await connectDB();
  try {
    const readYearsText = "SELECT * FROM tyear WHERE tyear IS NOT null";
    const years = (await pool.query(readYearsText)).rows;
    return { years };
  } catch (err) {
    logger.error(`Can't read artists names: ${err.stack}`);
  }
}

module.exports.readAll = readAll;
