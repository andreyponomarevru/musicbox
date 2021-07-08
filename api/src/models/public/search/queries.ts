import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";
import {
  TrackExtended,
  TrackExtendedDBResponse,
} from "../track/track-extended";
import { schemaSort, schemaPaginate } from "../../validation-schemas";
import { SortParams } from "../../../controllers/middlewares/parse-sort-params";
import { PaginationParams } from "../../../controllers/middlewares/parse-pagination-params";
import { schemaSearchQuery } from "../../validation-schemas";

type SearchResults = Promise<{
  items: TrackExtended[];
  totalCount: number;
}>;

export async function search(
  query: string,
  params: SortParams & PaginationParams,
): SearchResults {
  const searchQuery: string = await schemaSearchQuery.validateAsync(query);

  const { page, itemsPerPage } = await schemaPaginate.validateAsync({
    page: params.page,
    itemsPerPage: params.itemsPerPage,
  });
  const { sortBy, sortOrder } = await schemaSort.validateAsync({
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  const pool = await connectDB();

  try {
    const getTracks = {
      text: "\
				SELECT \
					v_t.*, \
					COUNT(*) OVER() AS total_count \
				FROM ( \
					SELECT DISTINCT \
						tr.track_id \
					FROM track AS tr \
						INNER JOIN track_artist AS tr_ar \
								ON tr_ar.track_id = tr.track_id \
						INNER JOIN artist AS ar \
								ON ar.artist_id = tr_ar.artist_id \
						INNER JOIN release AS re \
								ON tr.release_id = re.release_id \
					WHERE \
						tr.title ILIKE $1 OR \
						ar.name ILIKE $1 OR \
						re.title ILIKE $1 ) AS tmp \
				INNER JOIN view_track As v_t \
					ON v_t.track_id = tmp.track_id \
			LIMIT \
				$3 \
			OFFSET \
				($2::integer - 1) * $3 \
			",
      values: [`%${searchQuery}%`, page, itemsPerPage],
    };

    interface PaginatedDBResponse extends TrackExtendedDBResponse {
      total_count: number;
    }

    const response = await pool.query<PaginatedDBResponse>(getTracks);

    logger.info(response.rows);

    let tracks: TrackExtended[] = [];
    let total_count = 0;
    if (response.rowCount > 0) {
      tracks = response.rows.map((row) => new TrackExtended(row));
      total_count = response.rows[0].total_count;
    }

    const searchResults = { items: tracks, totalCount: total_count };

    return searchResults;
  } catch (err) {
    logger.error(`${__filename}: Error while searching for a track.`);
    throw err;
  }
}
