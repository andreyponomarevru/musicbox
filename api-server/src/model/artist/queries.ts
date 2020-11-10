import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

export async function readAll(): Promise<{ artists: object[] }> {
  const pool = await connectDB();
  try {
    const readArtistsQuery = {
      text:
        "SELECT artist_id, name \
         FROM artist \
         ORDER BY name ASC;",
    };
    const artists = (await pool.query(readArtistsQuery)).rows;
    return { artists };
  } catch (err) {
    logger.error(`Can't read artists names: ${err.stack}`);
    throw err;
  }
}
