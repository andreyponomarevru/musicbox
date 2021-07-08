import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";

export async function readLibStats() {
  const pool = await connectDB();
  try {
    const readLibStatsTextQuery = { text: "SELECT * FROM view_stats;" };
    const { rows } = await pool.query(readLibStatsTextQuery);

    return rows[0];
  } catch (err) {
    logger.error(`Can't read library stats: ${err.stack}`);
    throw err;
  }
}

export async function readGenreStats() {
  const pool = await connectDB();
  try {
    const readGenresStatsQuery =
      '\
				SELECT \
					ge.genre_id AS "id", \
					ge.name, \
					COUNT(*)::integer AS "tracks" \
				FROM \
					track AS tr \
					INNER JOIN track_genre AS tr_ge \
						ON tr.track_id = tr_ge.track_id \
					INNER JOIN genre AS ge \
						ON tr_ge.genre_id = ge.genre_id \
				GROUP BY \
					ge.genre_id \
				ORDER BY \
					ge.name ASC; \
			';

    const readGenreStats = { text: readGenresStatsQuery };
    const { rows } = await pool.query(readGenreStats);
    return rows;
  } catch (err) {
    logger.error(`Can't read genre stats: ${err.stack}`);
    throw err;
  }
}

export async function readYearStats() {
  const pool = await connectDB();
  try {
    const readYearsStatsQuery =
      '\
			SELECT \
				ty.tyear_id AS "id", \
				ty.tyear AS "name", \
				COUNT(*)::integer AS "tracks" \
			FROM \
				track AS tr \
				INNER JOIN release AS re \
					ON tr.release_id = re.release_id \
				INNER JOIN tyear AS ty \
					ON ty.tyear_id = re.tyear_id \
			GROUP BY \
				ty.tyear_id \
			ORDER BY \
				ty.tyear DESC; \
	';

    const readYearStats = { text: readYearsStatsQuery };
    const { rows } = await pool.query(readYearStats);
    return rows;
  } catch (err) {
    logger.error(`Can't read year stats: ${err.stack}`);
    throw err;
  }
}

export async function readArtistStats() {
  const pool = await connectDB();
  try {
    /*
			The number of artists returned by the query below is always less by one than if you do `SELECT * FROM artist` (or if you create `view_stats` but without `WHERE artist.name != 'Various'`) (as it us currently); it's not an error. The fact is that while every track in `track` table has one or more corresponding artists in `artist` table (through `track_artist` relation), there is one artist in `artist` table, that doesn't have corresponding tracks — the name of this artist is `Various`. That's why when you do JOINs below, the number of artists is less by one. `Various` artist corresponds to only some releases in `release` table, which are in fact compilations, including tracks by various artists. 

			The `Various` artist is not returned in any API responses and excluded from any views and statistics (note how I exclude it with WHERE clause in `view_stats` above; this way all views return the consistent number of artists in db). But we need to have this artist to keep releases which are compilations and not albums, organised. For example, in UI, when you click on some compilation, you can see that the release artist name is `Various`, while each track in compilation has its own artist. 

			To see what I'm talking about, just run this query: 

			select * from release where artist_id = 58; 

			58 is the id of `Various` artist; the query will return releases which are compilations.

			Now run this:

			select * from track_artist where artist_id = 58; 

			This query will return nothing cause there can be no _track_ whose artist is `Various`, only releases (which are compilations) may have the `Various` as artist.

			Also, currently you can't filter out tracks by `Various` artist in UI. In future, in grid view, we can use `Various` artist to group compilation type of releases.
		*/

    const readArtistsStatsQuery =
      '\
			SELECT \
				ar.artist_id AS "id", \
				ar.name, \
				COUNT(*)::integer AS "tracks" \
			FROM \
				track AS tr \
				INNER JOIN track_artist AS tr_ar \
					ON tr.track_id = tr_ar.track_id \
				INNER JOIN artist AS ar \
					ON tr_ar.artist_id = ar.artist_id \
			GROUP BY \
				ar.artist_id \
			ORDER BY \
				ar.name ASC; \
		';

    const readArtistStats = { text: readArtistsStatsQuery };
    const { rows } = await pool.query(readArtistStats);
    return rows;
  } catch (err) {
    logger.error(`Can't read artist stats: ${err.stack}`);
    throw err;
  }
}

export async function readLabelStats() {
  const pool = await connectDB();
  try {
    const readLabelStatsQuery =
      '\
			SELECT \
				la.label_id AS "id", \
				la.name, \
				COUNT(*)::integer AS "tracks" \
			FROM \
				release AS re \
				INNER JOIN track AS tr \
					ON tr.release_id = re.release_id \
				INNER JOIN label AS la \
					ON re.label_id = la.label_id \
				GROUP BY \
					la.label_id \
				ORDER BY \
					la.name ASC; \
		';

    const readLabelStats = { text: readLabelStatsQuery };
    const { rows } = await pool.query(readLabelStats);
    return rows;
  } catch (err) {
    logger.error(`Can't read label stats: ${err.stack}`);
    throw err;
  }
}
