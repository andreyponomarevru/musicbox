import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";

type ReadAllArtistsDBResponse = {
  artist_id: number;
  name: string;
};

type Artist = {
  artistId: number;
  name: string;
};

export async function readAll(): Promise<Artist[]> {
  const pool = await connectDB();
  try {
    const readAllArtistsQuery = {
      text: "\
				SELECT \
				  artist_id, \
					name \
				FROM \
					artist \
				ORDER BY \
					name ASC; \
			",
    };
    const response = await pool.query<ReadAllArtistsDBResponse>(
      readAllArtistsQuery,
    );

    if (response.rowCount > 0) {
      return response.rows.map(({ artist_id, name }) => {
        return { artistId: artist_id, name };
      });
    } else {
      return [];
    }
  } catch (err) {
    logger.error(`Can't read artists names: ${err.stack}`);
    throw err;
  }
}
