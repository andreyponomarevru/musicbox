import { logger } from "../../config/loggerConf.js";
import { connectDB } from "../postgres.js";

export async function readAll<T>(): Promise<{ genres: T[] }> {
  const pool = await connectDB();
  try {
    const readGenresText = "SELECT * FROM genre WHERE name IS NOT null";
    const genres = (await pool.query(readGenresText)).rows;
    return { genres };
  } catch (err) {
    logger.error(`Can't read genre names: ${err.stack}`);
    throw err;
  }
}
