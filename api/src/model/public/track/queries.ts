import util from "util";

import { logger } from "../../../config/loggerConf";
import { Track } from "./Track";
import { TrackExtended } from "./TrackExtended";
import { connectDB } from "../../postgres";
import { TrackExtendedMetadata, TrackMetadata } from "../../../types";

import {
  schemaCreateTrack,
  schemaUpdateTrack,
  schemaSortAndPaginate,
  schemaId,
} from "./../validation-schemas";

/*
 * Queries used only by REST API i.e. they are exposed through the controller
 */

export async function create(metadata: unknown) {
  const validatedMetadata: TrackMetadata = await schemaCreateTrack.validateAsync(
    metadata,
  );
  const track = new Track(validatedMetadata);

  const pool = await connectDB();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertExtensionQuery = {
      text:
        "WITH \
          input_rows (name) AS ( \
            VALUES ($1) \
          ), \
          \
          ins AS ( \
            INSERT INTO extension (name) \
            SELECT name \
            FROM input_rows \
            ON CONFLICT DO NOTHING \
            RETURNING extension_id \
          ) \
        \
        SELECT extension_id \
        FROM ins \
        \
        UNION ALL \
        \
        SELECT e.extension_id \
        FROM input_rows \
        JOIN extension AS e \
        USING (name);",
      values: [track.extension],
    };
    const { extension_id } = (await client.query(insertExtensionQuery)).rows[0];

    const insertTrackQuery = {
      text:
        "INSERT INTO track ( \
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
        RETURNING track_id",
      values: [
        extension_id,
        track.getReleaseId(),
        track.diskNo,
        track.trackNo,
        track.title,
        track.bitrate,
        track.duration,
        track.filePath,
      ],
    };
    const { track_id } = (await client.query(insertTrackQuery)).rows[0];

    for (const genre of track.genre) {
      const insertGenreQuery = {
        text:
          "WITH \
            input_rows (name) AS ( \
              VALUES ($1) \
            ), \
            \
            ins AS ( \
              INSERT INTO genre (name) \
              SELECT name \
              FROM input_rows \
              ON CONFLICT DO NOTHING \
              RETURNING genre_id \
            ) \
          \
          SELECT genre_id \
          FROM ins \
          \
          UNION ALL \
          \
          SELECT g.genre_id FROM input_rows \
          JOIN genre AS g \
          USING (name);",
        values: [genre],
      };
      const { genre_id } = (await client.query(insertGenreQuery)).rows[0];

      const inserTrackGenreQuery = {
        text:
          "INSERT INTO track_genre (track_id, genre_id) \
                VALUES ($1::integer, $2::integer) \
           ON CONFLICT DO NOTHING",
        values: [track_id, genre_id],
      };
      await client.query(inserTrackGenreQuery);
    }

    for (const artist of track.artist) {
      const insertArtistQuery = {
        text:
          "WITH \
          input_rows (name) AS ( \
            VALUES ($1) \
          ), \
          \
          ins AS ( \
            INSERT INTO artist (name) \
            SELECT name \
            FROM input_rows \
            ON CONFLICT DO NOTHING \
            RETURNING artist_id \
          ) \
          \
          SELECT artist_id \
          FROM ins \
          \
          UNION ALL \
          \
          SELECT a.artist_id FROM input_rows \
          JOIN artist AS a \
          USING (name);",
        values: [artist],
      };
      const { artist_id } = (await client.query(insertArtistQuery)).rows[0];

      const inserTrackArtistQuery = {
        text:
          "INSERT INTO track_artist (track_id, artist_id) \
                VALUES ($1::integer, $2::integer) \
           ON CONFLICT DO NOTHING",
        values: [track_id, artist_id],
      };
      await client.query(inserTrackArtistQuery);
    }

    await client.query("COMMIT");
    track.setTrackId(track_id);
    return track;
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(
      `${__filename}: ROLLBACK. Error occured while adding track "${track.filePath}" to database.`,
    );
    throw err;
  } finally {
    client.release();
  }
}

export async function update(newMetadata: unknown) {
  const validatedMetadata: TrackMetadata = await schemaUpdateTrack.validateAsync(
    newMetadata,
  );
  const track = new Track(validatedMetadata);

  const pool = await connectDB();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateExtensionQuery = {
      text:
        "WITH \
        input_rows (name) AS ( \
          VALUES ($1) \
        ), \
        \
        ins AS ( \
          INSERT INTO extension (name) \
          SELECT name \
          FROM input_rows \
          ON CONFLICT DO NOTHING \
          RETURNING extension_id \
        ) \
        \
        SELECT extension_id FROM ins \
        \
        UNION ALL \
        \
        SELECT e.extension_id \
        FROM input_rows \
        JOIN extension AS e \
        USING (name);",
      values: [track.extension],
    };
    const { extension_id } = (await client.query(updateExtensionQuery)).rows[0];

    const updateTrackQuery = {
      text:
        "UPDATE track \
         SET \
            extension_id = $1::integer, \
            disk_no = $2::smallint, \
            track_no = $3::smallint, \
            title = $4, \
            bitrate = $5::numeric, \
            duration = $6::numeric, \
            file_path = $7 \
        WHERE track_id = $8::integer RETURNING *;",
      values: [
        extension_id,
        track.diskNo,
        track.trackNo,
        track.title,
        track.bitrate,
        track.duration,
        track.filePath,
        track.getTrackId(),
      ],
    };

    await client.query(updateTrackQuery);

    //
    // Update Genre(s)
    //

    // Delete records (referencing the track) from linking table "track_genre"
    const deleteGenresFromLinkingTableQuery = {
      text: "DELETE FROM track_genre WHERE track_id = $1;",
      values: [track.getTrackId()],
    };
    await client.query(deleteGenresFromLinkingTableQuery);
    // Insert new genres
    for (const genre of track.genre) {
      const insertGenreQuery = {
        text:
          "WITH \
          input_rows (name) AS ( \
            VALUES ($1) \
          ), \
          \
          ins AS ( \
            INSERT INTO genre (name) \
            SELECT name \
            FROM input_rows \
            ON CONFLICT DO NOTHING \
            RETURNING genre_id \
          ) \
          \
          SELECT genre_id \
          FROM ins \
          \
          UNION ALL \
          \
          SELECT g.genre_id FROM input_rows \
          JOIN genre AS g \
          USING (name);",
        values: [genre],
      };
      const { genre_id } = (await client.query(insertGenreQuery)).rows[0];

      const inserTrackGenreQuery = {
        text:
          "INSERT INTO \
            track_genre (track_id, genre_id) \
           VALUES ($1::integer, $2::integer) \
           ON CONFLICT DO NOTHING",
        values: [track.getTrackId(), genre_id],
      };
      await client.query(inserTrackGenreQuery);
    }
    // Perform cleanup: delete GENRE record if it is not referenced by any records in track_artist linking table
    const deleteUnreferencedGenresQuery = {
      text:
        "DELETE FROM genre \
         WHERE genre_id IN ( \
           SELECT genre_id \
           FROM genre \
           WHERE genre_id \
           NOT IN (SELECT genre_id FROM track_genre) \
         )",
    };
    await client.query(deleteUnreferencedGenresQuery);

    //
    // Update Artist(s)
    //

    // Delete records (referencing the track) from linking table "track_artist"
    const deleteArtistsFromLinkingTableQuery = {
      text: "DELETE FROM track_artist WHERE track_id = $1;",
      values: [track.getTrackId()],
    };
    await client.query(deleteArtistsFromLinkingTableQuery);
    // Insert new artists
    for (const artist of track.artist) {
      const insertArtistQuery = {
        text:
          "WITH \
          input_rows (name) AS ( \
            VALUES ($1) \
          ), \
          \
          ins AS ( \
            INSERT INTO artist (name) \
            SELECT name \
            FROM input_rows \
            ON CONFLICT DO NOTHING \
            RETURNING artist_id \
          ) \
          \
          SELECT artist_id \
          FROM ins \
          \
          UNION ALL \
          \
          SELECT a.artist_id FROM input_rows \
          JOIN artist AS a \
          USING (name);",
        values: [artist],
      };
      const { artist_id } = (await client.query(insertArtistQuery)).rows[0];

      const inserTrackArtistQuery = {
        text:
          "INSERT INTO track_artist (track_id, artist_id) \
             VALUES ($1::integer, $2::integer) \
           ON CONFLICT DO NOTHING",
        values: [track.getTrackId(), artist_id],
      };
      await client.query(inserTrackArtistQuery);
    }
    // Perform cleanup: delete ARTIST record if it is not referenced by any records in track_artist linking table
    const deleteUnreferencedArtistsQuery = {
      text:
        "DELETE FROM artist \
         WHERE artist_id IN ( \
           SELECT artist_id \
           FROM artist \
           WHERE artist_id \
           NOT IN \
            (SELECT artist_id \
            FROM track_artist \
            UNION \
            SELECT artist_id \
            FROM release) \
         )",
    };
    await client.query(deleteUnreferencedArtistsQuery);

    await client.query("COMMIT");
    return track;
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(
      `${__filename}: ROLLBACK. Error occured while updating track "${track.filePath}" in database.`,
    );
    throw err;
  } finally {
    client.release();
  }
}

export async function read(id: unknown) {
  const validatedId: number = await schemaId.validateAsync(id);
  const pool = await connectDB();

  try {
    const getTrackTextQuery = {
      text: 'SELECT * FROM view_track WHERE "trackId"=$1',
      values: [validatedId],
    };
    const trackMetadata = (await pool.query(getTrackTextQuery)).rows[0];

    if (!trackMetadata) return null;
    const track = new Track(trackMetadata);
    return track;
  } catch (err) {
    logger.error(`${__filename}: Error while reading a track.`);
    throw err;
  }
}

export async function readAll(params: unknown) {
  let {
    sortBy,
    sortOrder,
    page,
    itemsPerPage,
  } = await schemaSortAndPaginate.validateAsync(params);

  logger.debug(
    `sortBy: ${sortBy} sortOrder: ${sortOrder}, page: ${page}, itemsPerPage: ${itemsPerPage}`,
  );
  const pool = await connectDB();

  try {
    const readTracksQuery = {
      text: `
         SELECT \
         (SELECT COUNT (*) FROM view_track)::integer AS total_count, \
         (SELECT json_agg(t.*) FROM \
           (SELECT * FROM view_track \
           ORDER BY \
             CASE WHEN $1 = 'asc' THEN "${sortBy}" END ASC, \
             CASE WHEN $1 = 'asc' THEN 'trackId' END ASC, \
             CASE WHEN $1 = 'desc' THEN "${sortBy}" END DESC, \
             CASE WHEN $1 = 'desc' THEN 'trackId' END DESC \
           LIMIT $3::integer \
           OFFSET ($2::integer - 1) * $3::integer \
           ) AS t) \
         AS tracks;
         `,
      values: [sortOrder, page, itemsPerPage],
    };

    const collection: {
      tracks: TrackExtendedMetadata[] | null;
      total_count: number;
    } = (await pool.query(readTracksQuery)).rows[0];

    const tracks = collection.tracks
      ? collection.tracks.map((row) => new TrackExtended(row))
      : [];
    const total_count: number = collection.total_count;

    return { items: tracks, totalCount: total_count };
  } catch (err) {
    logger.error(
      `${__filename}: Error while retrieving all tracks with pagination.\n${err.stack}`,
    );
    throw err;
  }
}

export async function destroy(trackId: unknown) {
  const validatedTrackId: number = await schemaId.validateAsync(trackId);
  const pool = await connectDB();
  const client = await pool.connect();

  try {
    const deleteTrackQuery = {
      // Delete TRACK ( + corresponding records in track_genre and track_artist cascadingly)
      text:
        "DELETE FROM track \
         WHERE track_id = $1 \
         RETURNING track_id",
      values: [validatedTrackId],
    };

    // Try to delete the RELEASE if no other tracks reference it
    const deleteReleaseQuery = {
      text:
        "DELETE FROM release \
         WHERE release_id IN ( \
           SELECT release_id \
           FROM release \
           WHERE release_id \
           NOT IN ( \
             SELECT release_id \
             FROM track \
           ) \
        )",
    };

    const deleteYearQuery = {
      // Try to delete YEAR record if it is not referenced by any records in
      // 'release'
      text:
        "DELETE FROM tyear \
         WHERE tyear_id IN ( \
           SELECT tyear_id \
           FROM tyear \
           WHERE tyear_id \
           NOT IN ( \
             SELECT tyear_id \
             FROM release \
           ) \
        )",
    };

    const deleteLabelQuery = {
      // Try to delete LABEL record if it is not referenced by any records in
      // 'release'
      text:
        "DELETE FROM label \
         WHERE label_id IN ( \
           SELECT label_id \
           FROM label \
           WHERE label_id \
           NOT IN ( \
             SELECT label_id \
             FROM release \
           ) \
         )",
    };

    const deleteExtensionQuery = {
      // Try to delete EXTENSION record if it is not referenced by any records
      // in  'track'
      text:
        "DELETE FROM extension \
         WHERE extension_id IN ( \
           SELECT extension_id \
           FROM extension \
           WHERE extension_id \
           NOT IN ( \
             SELECT extension_id \
             FROM track \
           ) \
         )",
    };

    const deleteGenreQuery = {
      // Try to delete GENRE record if it is not referenced by any records in
      // 'track_genre'
      text:
        "DELETE FROM genre \
         WHERE genre_id IN ( \
           SELECT genre_id \
           FROM genre \
           WHERE genre_id \
           NOT IN ( \
             SELECT genre_id \
             FROM track_genre \
           ) \
         )",
    };

    const deleteArtistQuery = {
      // Try to delete ARTIST record if it is not referenced by any records in
      // track_artist and release tables
      text:
        "DELETE FROM artist \
         WHERE artist_id IN ( \
          SELECT artist_id \
          FROM artist \
          WHERE artist.artist_id \
          NOT IN ( \
            SELECT artist_id \
            FROM track_artist \
            UNION \
            SELECT artist_id \
            FROM release \
          ) \
        );",
    };

    await client.query("BEGIN");
    const deletedTrackId: number = (await client.query(deleteTrackQuery))
      .rows[0];
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
