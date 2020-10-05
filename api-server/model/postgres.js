const logger = require("../utility/loggerConf.js");
const { Pool } = require("pg");

const {
  POSTGRES_USER: user,
  POSTGRES_PASSWORD: password,
  POSTGRES_HOST: host,
  POSTGRES_DATABASE: database,
  POSTGRES_PORT: port,
} = process.env;
let pool;

async function connectDB() {
  if (pool) {
    return pool;
  } else {
    pool = new Pool({ user, host, database, password, port });
    return pool;
  }
}

// Shutdown cleanly. Doc: https://node-postgres.com/api/pool#poolend
async function close() {
  if (pool) await pool.end();
  pool = undefined;
  logger.debug("Pool has ended");
}

module.exports.connectDB = connectDB;
module.exports.close = close;
