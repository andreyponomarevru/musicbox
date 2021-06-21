import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";

export async function readAll() {
  const pool = await connectDB();
  try {
    const readArtistsQuery = {
      text:
        'SELECT artist_id AS "artistId", name \
         FROM artist \
         ORDER BY name ASC;',
    };
    const artists = (await pool.query(readArtistsQuery)).rows;
    return artists;
  } catch (err) {
    logger.error(`Can't read artists names: ${err.stack}`);
    throw err;
  }
}
