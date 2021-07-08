import { logger } from "../../../config/logger";
import { Track } from "./track";
import { TrackExtended, TrackExtendedDBResponse } from "./track-extended";
import { connectDB } from "../../postgres";

import {
  schemaSort,
  schemaPaginate,
  schemaId,
  schemaFilterParams,
} from "../../validation-schemas";
import { PaginatedDBResponse, PaginatedAPIResponse } from "./../../../types";
import { SortParams } from "../../../controllers/middlewares/parse-sort-params";
import { PaginationParams } from "../../../controllers/middlewares/parse-pagination-params";
import {
  CreateTrack,
  UpdateTrack,
  FilterParams,
  TrackMeta,
  FilePathDBResponse,
} from "./types";
import { schemaCreateTrack, schemaUpdateTrack } from "./validation-schemas";

export async function filter({
  sort,
  pagination,
  filters,
}: {
  sort: SortParams;
  pagination: PaginationParams;
  filters: FilterParams;
}): Promise<PaginatedAPIResponse<TrackExtended> | never> {
  try {
    const { sortBy, sortOrder } = await schemaSort.validateAsync(sort);
    const { page, itemsPerPage } = await schemaPaginate.validateAsync(
      pagination,
    );
    const { yearIds, artistIds, labelIds, genreIds } =
      await schemaFilterParams.validateAsync(filters);

    const pool = await connectDB();

    const sql = `\
				SELECT \
					json_agg (t.*) AS items, \
					total_count \
				FROM \
				\
					(\
						SELECT \
							view_track.*, \
							COUNT (*) OVER() AS total_count \
						FROM \
							view_track \
						INNER JOIN track AS tr \
							 ON tr.track_id = view_track.track_id \
						INNER JOIN release AS re \
							 ON re.release_id = tr.release_id \
						INNER JOIN tyear AS ty \
							 ON ty.tyear_id = re.tyear_id \
						INNER JOIN track_genre AS tr_ge \
							 ON tr_ge.track_id = tr.track_id \
						INNER JOIN genre AS ge \
							 ON tr_ge.genre_id = ge.genre_id \
						INNER JOIN label AS la \
							 ON la.label_id = re.label_id \
						INNER JOIN track_artist AS tr_ar \
							 ON tr_ar.track_id = tr.track_id \
						INNER JOIN artist AS ar \
							 ON ar.artist_id = tr_ar.artist_id \
		
						WHERE \
							( $1::integer[] IS NULL OR ty.tyear_id = ANY ($1) ) AND \
							( $2::integer[] IS NULL OR ge.genre_id = ANY ($2) ) AND \
							( $3::integer[] IS NULL OR la.label_id = ANY ($3) ) AND \
							( $4::integer[] IS NULL OR ar.artist_id = ANY ($4) ) \
		
						GROUP BY 
							view_track.track_id,
							view_track.release_id,
							view_track.release_title,
							view_track.release_artist,
							view_track.year,
							view_track.cat_no,
							view_track.label,
							view_track.track_artist,
							view_track.track_title,
							view_track.genre,
							view_track.extension,
							view_track.bitrate,
							view_track.duration,
							view_track.bpm,
							view_track.cover_path,
							view_track.file_path,
							view_track.track_no,
							view_track.disk_no

						ORDER BY \
							CASE WHEN $5 = 'asc' THEN "${sortBy}" END ASC,\
							CASE WHEN $5 = 'asc' THEN view_track.track_id END ASC, \
							CASE WHEN $5 = 'desc' THEN "${sortBy}" END DESC, \
							CASE WHEN $5 = 'desc' THEN view_track.track_id END DESC \

						LIMIT \
							$6::integer \
						OFFSET \
							($7::integer - 1) * $6::integer\
					) \
					\
					AS t \
					\
					GROUP BY \
						total_count`;

    const filterQuery = {
      text: sql,
      values: [
        yearIds,
        genreIds,
        labelIds,
        artistIds,
        sortOrder,
        itemsPerPage,
        page,
      ],
    };

    const res = await pool.query<PaginatedDBResponse<TrackExtendedDBResponse>>(
      filterQuery,
    );

    const isResponseEmpty =
      res.rowCount === 0 || res.rows[0].total_count === 0 || !res.rows[0].items;

    if (isResponseEmpty) {
      return { items: [], totalCount: 0 };
    } else {
      const tracks = res.rows[0].items.map((track) => new TrackExtended(track));
      return { items: tracks, totalCount: res.rows[0].total_count };
    }
  } catch (err) {
    logger.error(`${__filename}: Error while filtering tracks."`);
    throw err;
  }
}

export async function create(meta: CreateTrack): Promise<Track> {
  const newTrack: CreateTrack = await schemaCreateTrack.validateAsync(meta);

  const pool = await connectDB();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertExtensionQuery = {
      text: "\
				WITH \
          input_rows (name) AS ( \
            VALUES ($1) \
          ), \
          \
          ins AS ( \
						INSERT INTO \
							extension (name) \
						SELECT \
							name \
						FROM \
							input_rows \
            ON CONFLICT DO NOTHING \
						RETURNING \
							extension_id \
          ) \
        \
				SELECT \
					extension_id \
				FROM \
					ins \
        \
        UNION ALL \
        \
				SELECT \
					e.extension_id \
				FROM \
					input_rows \
				JOIN \
					extension AS e \
				USING \
					(name);",
      values: [newTrack.extension],
    };
    const { extension_id } = (await client.query(insertExtensionQuery)).rows[0];

    const insertTrackQuery = {
      text: "\
				INSERT INTO track ( \
          extension_id, \
          release_id, \
          disk_no, \
          track_no, \
          title, \
          bitrate, \
          duration, \
          file_path \
        ) \
        VALUES (\
          $1::integer, \
          $2::integer, \
          $3::smallint, \
          $4::smallint, \
          $5, \
          $6::numeric, \
          $7::numeric, \
          $8 \
        ) \
				RETURNING \
					track_id",
      values: [
        extension_id,
        newTrack.releaseId,
        newTrack.diskNo,
        newTrack.trackNo,
        newTrack.title,
        newTrack.bitrate,
        newTrack.duration,
        newTrack.filePath,
      ],
    };
    const { track_id } = (await client.query(insertTrackQuery)).rows[0];

    for (const genre of newTrack.genre) {
      const insertGenreQuery = {
        text: "\
					WITH \
            input_rows (name) AS ( \
              VALUES ($1) \
            ), \
            \
            ins AS ( \
							INSERT INTO \
								genre (name) \
							SELECT \
								name \
							FROM \
								input_rows \
              ON CONFLICT DO NOTHING \
							RETURNING \
								genre_id \
            ) \
          \
					SELECT \
						genre_id \
					FROM \
						ins \
          \
          UNION ALL \
          \
					SELECT \
						g.genre_id \
					FROM \
						input_rows \
					JOIN \
						genre AS g \
					USING \
						(name);",
        values: [genre],
      };
      const { genre_id } = (await client.query(insertGenreQuery)).rows[0];

      const inserTrackGenreQuery = {
        text: "\
					INSERT INTO \
						track_genre (\
							track_id, \
							genre_id \
						) \
						VALUES (\
							$1::integer, \
							$2::integer\
						) \
           ON CONFLICT DO NOTHING",
        values: [track_id, genre_id],
      };
      await client.query(inserTrackGenreQuery);
    }

    for (const artist of newTrack.artist) {
      const insertArtistQuery = {
        text: "\
					WITH \
						input_rows (name) AS ( \
							VALUES ($1) \
						), \
						\
						ins AS ( \
							INSERT INTO \
								artist (name) \
							SELECT \
								name \
							FROM \
								input_rows \
							ON CONFLICT DO NOTHING \
							RETURNING \
								artist_id \
						) \
          \
					SELECT \
						artist_id \
					FROM \
						ins \
          \
          UNION ALL \
          \
					SELECT \
						a.artist_id \
					FROM \
						input_rows \
					JOIN \
						artist AS a \
					USING \
						(name);",
        values: [artist],
      };
      const { artist_id } = (await client.query(insertArtistQuery)).rows[0];

      const inserTrackArtistQuery = {
        text: "\
					INSERT INTO \
						track_artist (\
							track_id, \
							artist_id\
						) \
					VALUES (\
						$1::integer, \
						$2::integer\
					) \
          ON CONFLICT DO NOTHING",
        values: [track_id, artist_id],
      };
      await client.query(inserTrackArtistQuery);
    }

    await client.query("COMMIT");

    const track = new Track({
      file_path: newTrack.filePath,
      extension: newTrack.extension,
      artist: newTrack.artist,
      duration: newTrack.duration,
      bitrate: newTrack.bitrate,
      track_no: newTrack.trackNo,
      title: newTrack.title,
      disk_no: newTrack.diskNo,
      genre: newTrack.genre,
      release_id: newTrack.releaseId,
      track_id,
    });

    return track as Track;
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(
      `${__filename}: ROLLBACK. Error occured while adding track "${newTrack.filePath}" to database.`,
    );
    throw err;
  } finally {
    client.release();
  }
}

export async function update(id: number, newMeta: TrackMeta): Promise<Track> {
  const updatedMeta: UpdateTrack = await schemaUpdateTrack.validateAsync({
    id,
    ...newMeta,
  });

  const pool = await connectDB();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateExtensionQuery = {
      text: "\
				WITH \
					input_rows (name) AS ( \
						VALUES ($1) \
					), \
					\
					ins AS ( \
						INSERT INTO \
							extension (name) \
						SELECT \
							name \
						FROM \
							input_rows \
						ON CONFLICT DO NOTHING \
						RETURNING \
							extension_id \
					) \
        \
				SELECT \
					extension_id \
				FROM \
					ins \
        \
        UNION ALL \
        \
				SELECT \
					e.extension_id \
				FROM \
					input_rows \
				JOIN \
					extension AS e \
				USING \
					(name);",
      values: [updatedMeta.extension],
    };
    const { extension_id } = (await client.query(updateExtensionQuery)).rows[0];

    const updateTrackQuery = {
      text: "\
				UPDATE \
					track \
        SET \
					extension_id = $1::integer, \
					disk_no = $2::smallint, \
					track_no = $3::smallint, \
					title = $4, \
					bitrate = $5::numeric, \
					duration = $6::numeric, \
					file_path = $7 \
				WHERE \
					track_id = $8::integer \
				RETURNING *;",
      values: [
        extension_id,
        updatedMeta.diskNo,
        updatedMeta.trackNo,
        updatedMeta.title,
        updatedMeta.bitrate,
        updatedMeta.duration,
        updatedMeta.filePath,
        updatedMeta.trackId,
      ],
    };

    await client.query(updateTrackQuery);

    //
    // Update Genre(s)
    //

    // Delete records (referencing the track) from linking table "track_genre"
    const deleteGenresFromLinkingTableQuery = {
      text: "\
				DELETE FROM \
					track_genre \
				WHERE \
					track_id = $1;",
      values: [updatedMeta.trackId],
    };
    await client.query(deleteGenresFromLinkingTableQuery);
    // Insert new genres
    for (const genre of updatedMeta.genre) {
      const insertGenreQuery = {
        text: "\
					WITH \
						input_rows (name) AS ( \
							VALUES ($1) \
						), \
						\
						ins AS ( \
							INSERT INTO \
								genre (name) \
							SELECT \
								name \
							FROM \
								input_rows \
							ON CONFLICT DO NOTHING \
							RETURNING \
								genre_id \
						) \
          \
					SELECT \
						genre_id \
					FROM \
						ins \
          \
          UNION ALL \
          \
					SELECT \
						g.genre_id \
					FROM \
						input_rows \
					JOIN \
						genre AS g \
					USING \
						(name);",
        values: [genre],
      };
      const { genre_id } = (await client.query(insertGenreQuery)).rows[0];

      const inserTrackGenreQuery = {
        text: "\
					INSERT INTO \
						track_genre (\
							track_id, \
							genre_id\
						) \
					VALUES (\
						$1::integer, \
						$2::integer\
					) \
					ON CONFLICT DO NOTHING",
        values: [updatedMeta.trackId, genre_id],
      };
      await client.query(inserTrackGenreQuery);
    }
    // Perform cleanup: delete GENRE record if it is not referenced by any records in track_artist linking table
    const deleteUnreferencedGenresQuery = {
      text: "\
				DELETE FROM \
					genre \
				WHERE \
					genre_id \
				IN ( \
					SELECT \
						genre_id \
					FROM \
						genre \
					WHERE \
						genre_id \
					NOT IN (\
						SELECT \
							genre_id \
						FROM \
							track_genre\
					) \
        )",
    };
    await client.query(deleteUnreferencedGenresQuery);

    //
    // Update Artist(s)
    //

    // Delete records (referencing the track) from linking table "track_artist"
    const deleteArtistsFromLinkingTableQuery = {
      text: "\
				DELETE FROM \
					track_artist \
				WHERE \
					track_id = $1;",
      values: [updatedMeta.trackId],
    };
    await client.query(deleteArtistsFromLinkingTableQuery);
    // Insert new artists
    for (const artist of updatedMeta.artist) {
      const insertArtistQuery = {
        text: "\
					WITH \
						input_rows (name) AS ( \
							VALUES ($1) \
						), \
						\
						ins AS ( \
							INSERT INTO \
								artist (name) \
							SELECT \
								name \
							FROM \
								input_rows \
							ON CONFLICT DO NOTHING \
							RETURNING \
								artist_id \
						) \
          \
					SELECT \
						artist_id \
					FROM \
						ins \
          \
          UNION ALL \
          \
					SELECT \
						a.artist_id \
					FROM \
						input_rows \
					JOIN \
						artist AS a \
					USING \
						(name);",
        values: [artist],
      };
      const { artist_id } = (await client.query(insertArtistQuery)).rows[0];

      const inserTrackArtistQuery = {
        text: "\
					INSERT INTO \
						track_artist (\
							track_id, \
							artist_id\
						) \
					VALUES (\
						$1::integer, \
						$2::integer\
					) \
          ON CONFLICT DO NOTHING",
        values: [updatedMeta.trackId, artist_id],
      };
      await client.query(inserTrackArtistQuery);
    }
    // Perform cleanup: delete ARTIST record if it is not referenced by any records in track_artist linking table
    const deleteUnreferencedArtistsQuery = {
      text: "\
				DELETE FROM \
					artist \
				WHERE \
					artist_id \
				IN ( \
					SELECT \
						artist_id \
					FROM \
						artist \
					WHERE \
						artist_id \
					NOT IN (\
						SELECT \
							artist_id \
						FROM \
							track_artist \
            UNION \
						SELECT \
							artist_id \
						FROM \
							release\
					) \
        )",
    };
    await client.query(deleteUnreferencedArtistsQuery);

    await client.query("COMMIT");

    const updatedTrack = new Track({
      track_id: updatedMeta.trackId,
      release_id: updatedMeta.releaseId,
      file_path: updatedMeta.filePath,
      extension: updatedMeta.extension,
      artist: updatedMeta.artist,
      duration: updatedMeta.duration,
      bitrate: updatedMeta.bitrate,
      track_no: updatedMeta.trackNo,
      title: updatedMeta.title,
      disk_no: updatedMeta.diskNo,
      genre: updatedMeta.genre,
    });
    return updatedTrack;
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(
      `${__filename}: ROLLBACK. Error occured while updating track "${updatedMeta.filePath}" in database.`,
    );
    throw err;
  } finally {
    client.release();
  }
}

export async function read(id: unknown): Promise<TrackExtended | null> {
  const validatedId: number = await schemaId.validateAsync(id);
  const pool = await connectDB();

  try {
    const getTrackTextQuery = {
      text: "SELECT * FROM view_track WHERE track_id = $1",
      values: [validatedId],
    };
    const trackMetadata = (
      await pool.query<TrackExtendedDBResponse>(getTrackTextQuery)
    ).rows[0];
    return trackMetadata ? new TrackExtended(trackMetadata) : null;
  } catch (err) {
    logger.error(`${__filename}: Error while reading a track.`);
    throw err;
  }
}

export async function destroy(trackId: unknown): Promise<number> {
  const validatedTrackId: number = await schemaId.validateAsync(trackId);
  const pool = await connectDB();
  const client = await pool.connect();

  try {
    const deleteTrackQuery = {
      // Delete TRACK ( + corresponding records in track_genre and track_artist cascadingly)
      text: "\
				DELETE FROM \
					track \
				WHERE \
					track_id = $1 \
				RETURNING \
					track_id",
      values: [validatedTrackId],
    };

    // Try to delete the RELEASE if no other tracks reference it
    const deleteReleaseQuery = {
      text: "\
				DELETE FROM \
					release \
				WHERE \
					release_id \
				IN ( \
					SELECT \
						release_id \
					FROM \
						release \
					WHERE \
						release_id \
          NOT IN ( \
						SELECT \
							release_id \
						FROM \
							track \
					) \
				)",
    };

    const deleteYearQuery = {
      // Try to delete YEAR record if it is not referenced by any records in
      // 'release'
      text: "\
				DELETE FROM \
					tyear \
				WHERE \
					tyear_id \
				IN ( \
					SELECT \
						tyear_id \
					FROM \
						tyear \
					WHERE \
						tyear_id \
          NOT IN ( \
						SELECT \
							tyear_id \
						FROM \
							release \
					) \
        )",
    };

    const deleteLabelQuery = {
      // Try to delete LABEL record if it is not referenced by any records in
      // 'release'
      text: "\
				DELETE FROM \
					label \
				WHERE \
					label_id \
				IN ( \
					SELECT \
						label_id \
					FROM \
						label \
					WHERE \
						label_id \
          NOT IN ( \
						SELECT \
							label_id \
						FROM \
							release \
           ) \
         )",
    };

    const deleteExtensionQuery = {
      // Try to delete EXTENSION record if it is not referenced by any records
      // in  'track'
      text: "\
				DELETE FROM \
					extension \
				WHERE \
					extension_id \
				IN ( \
					SELECT \
						extension_id \
					FROM \
						extension \
					WHERE \
						extension_id \
          NOT IN ( \
						SELECT \
							extension_id \
						FROM \
							track \
					) \
				)",
    };

    const deleteGenreQuery = {
      // Try to delete GENRE record if it is not referenced by any records in
      // 'track_genre'
      text: "\
				DELETE FROM \
					genre \
				WHERE \
					genre_id \
				IN ( \
					SELECT \
						genre_id \
					FROM \
						genre \
					WHERE \
						genre_id \
          NOT IN ( \
						SELECT \
							genre_id \
						FROM \
							track_genre \
          ) \
				)",
    };

    const deleteArtistQuery = {
      // Try to delete ARTIST record if it is not referenced by any records in
      // track_artist and release tables
      text: "\
				DELETE FROM \
					artist \
				WHERE \
					artist_id \
				IN ( \
					SELECT \
						artist_id \
					FROM \
						artist \
					WHERE \
						artist.artist_id \
          NOT IN ( \
						SELECT \
							artist_id \
						FROM \
							track_artist \
            UNION \
						SELECT \
							artist_id \
						FROM \
							release \
          ) \
        );",
    };

    await client.query("BEGIN");
    const res = await client.query(deleteTrackQuery);
    const deletedTrackId: number = res.rows[0];

    await client.query(deleteReleaseQuery);
    await client.query(deleteYearQuery);
    await client.query(deleteLabelQuery);
    await client.query(deleteExtensionQuery);
    await client.query(deleteGenreQuery);
    await client.query(deleteArtistQuery);
    await client.query("COMMIT");
    return deletedTrackId;
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(
      `${__filename}: ROLLBACK. Can't delete track. Track doesn't exist or an error occured during deletion.`,
    );
    throw err;
  } finally {
    client.release();
  }
}

export async function getFilePath(
  id: unknown,
): Promise<{ filePath: string | "" }> {
  const validatedId: number = await schemaId.validateAsync(id);
  const pool = await connectDB();

  try {
    const getFilePath = {
      text: "\
				SELECT \
					file_path \
				FROM \
					view_track \
				WHERE \
					track_id = $1",
      values: [validatedId],
    };
    const response = await pool.query<FilePathDBResponse>(getFilePath);

    logger.info(response.rows);

    return { filePath: response.rows[0].file_path };
  } catch (err) {
    logger.error(`${__filename}: Error while reading file path."`);
    throw err;
  }
}
