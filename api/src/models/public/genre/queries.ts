import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";

type ReadAllGenresDBResponse = {
  genre_id: number;
  name: string;
};

type Genre = {
  genreId: number;
  name: string;
};

export async function readAll(): Promise<Genre[]> {
  const pool = await connectDB();
  try {
    const readAllGenresQuery = {
      text: "\
				SELECT \
					genre_id, \
					name \
				FROM \
					genre \
				ORDER BY \
					name ASC; \
			",
    };
    const response = await pool.query<ReadAllGenresDBResponse>(
      readAllGenresQuery,
    );

    if (response.rowCount > 0) {
      return response.rows.map(({ genre_id, name }) => {
        return { genreId: genre_id, name };
      });
    } else {
      return [];
    }
  } catch (err) {
    logger.error(`Can't read genre names: ${err.stack}`);
    throw err;
  }
}
