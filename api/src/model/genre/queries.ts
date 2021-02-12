import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

export async function readAll() {
  const pool = await connectDB();
  try {
    const readGenresQuery = {
      text:
        'SELECT genre_id AS "genreId", name \
         FROM genre \
         ORDER BY name ASC;',
    };
    const genres = (await pool.query(readGenresQuery)).rows;
    return genres;
  } catch (err) {
    logger.error(`Can't read genre names: ${err.stack}`);
    throw err;
  }
}
