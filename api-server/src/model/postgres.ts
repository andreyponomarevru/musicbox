import { logger } from "../config/loggerConf";
import { Pool } from "pg";

const {
  POSTGRES_USER: user,
  POSTGRES_PASSWORD: password,
  POSTGRES_HOST: host,
  POSTGRES_DATABASE: database,
} = process.env;
const port = Number(process.env.POSTGRES_PORT);

let pool: Pool | undefined;

export async function connectDB(): Promise<Pool> {
  if (pool) {
    return pool;
  } else {
    pool = new Pool({ user, host, database, password, port });
    return pool;
  }
}

// Shutdown cleanly. Doc: https://node-postgres.com/api/pool#poolend
export async function close(): Promise<void> {
  if (pool) await pool.end();
  pool = undefined;
  logger.info("Pool has ended");
}
