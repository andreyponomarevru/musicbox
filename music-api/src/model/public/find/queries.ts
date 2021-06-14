import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";
import { TrackExtendedMeta } from "../../../types";
import { TrackExtended } from "../track/track-extended";
import { schemaSortAndPaginate } from "../validation-schemas";

// Search only in release and track titles

type FindReturn = Promise<{
  items: TrackExtended[];
  totalCount: number;
}>;

export async function find(query: unknown, params: unknown): FindReturn {
  const searchString = String(query).toLowerCase();

  const { sortBy, sortOrder, page, itemsPerPage } =
    await schemaSortAndPaginate.validateAsync(params);

  logger.debug(
    `sortBy: ${sortBy} sortOrder: ${sortOrder}, page: ${page}, itemsPerPage: ${itemsPerPage}`,
  );

  const pool = await connectDB();

  console.log(query, params);

  try {
    const getTracks = {
      //text: 'SELECT * FROM view_track WHERE "trackTitle" ILIKE $1',
      text: '\
				SELECT \
				(SELECT COUNT (*) FROM view_track \
				WHERE "trackTitle" ILIKE $1)::integer AS total_count, \
				(SELECT json_agg(t.*) FROM \
					(SELECT * FROM view_track \
					 WHERE "trackTitle" ILIKE $1 \
					ORDER BY "trackTitle" DESC LIMIT $3::integer \
					OFFSET ($2::integer - 1) * $3::integer \
					) AS t) \
				AS tracks',
      values: [`%${searchString}%`, page, itemsPerPage],
    };

    type DBResponse = {
      tracks: TrackExtendedMeta[] | null;
      total_count: number;
    };

    const collection = (await pool.query<DBResponse>(getTracks)).rows[0];

    const tracks = collection.tracks
      ? collection.tracks.map((row) => new TrackExtended(row))
      : [];
    const total_count: number = collection.total_count;
    const res = { items: tracks, totalCount: total_count };
    //logger.info(collection);

    return res;
  } catch (err) {
    logger.error(`${__filename}: Error while reading a track.`);
    throw err;
  }
}
