import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

export async function readAll<T>(): Promise<{ artists: T[] }> {
  const pool = await connectDB();
  try {
    const readArtistsText = "SELECT * FROM artist WHERE name IS NOT null";
    const artists = (await pool.query(readArtistsText)).rows;
    return { artists };
  } catch (err) {
    logger.error(`Can't read artists names: ${err.stack}`);
    throw err;
  }
}
