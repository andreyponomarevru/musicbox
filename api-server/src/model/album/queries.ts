import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

export async function readAll<T>(): Promise<{ albums: T[] }> {
  const pool = await connectDB();
  try {
    const readAlbumsText =
      "SELECT DISTINCT ON (album) album, track_id FROM track ORDER BY album";
    const albums = (await pool.query(readAlbumsText)).rows;
    return { albums };
  } catch (err) {
    logger.error(`Can't read album names: ${err.stack}`);
    throw err;
  }
}
