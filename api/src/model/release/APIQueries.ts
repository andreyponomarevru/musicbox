import util from "util";

import { Track } from "./../track/localTrack";
import { HttpError } from "../../utility/http-errors/HttpError";
import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";
import { ReleaseMetadata, ReleaseShortMetadata } from "../../types";
import { Release } from "./Release";
import { ReleaseShort } from "./ReleaseShort";
import { SORT_BY, PER_PAGE_NUMS, SORT_ORDER } from "../../utility/constants";
import { DBError } from "../../utility/db-errors/DBError";
import {
  schemaCreateRelease,
  schemaSortAndPaginate,
  schemaUpdateRelease,
  schemaId,
} from "./../validation-schemas";

import { PaginatedCollection } from "./../../types";

/*
 * Queries used only by REST API i.e. they are exposed through the controller
 */

export async function create(metadata: unknown) {
  const validatedMetadata: ReleaseMetadata = await schemaCreateRelease.validateAsync(
    metadata,
  );
  const release = new Release(validatedMetadata);

  const pool = await connectDB();
  const client = await pool.connect();

  try {
    const insertYearQuery = {
      text:
        "WITH \
        input_rows (tyear) AS ( \
          VALUES ($1::smallint) \
        ), \
        \
        ins AS ( \
          INSERT INTO tyear (tyear) \
          SELECT tyear \
          FROM input_rows \
          ON CONFLICT DO NOTHING \
          RETURNING tyear_id \
        ) \
        \
        SELECT tyear_id FROM ins \
        \
        UNION ALL \
        \
        SELECT t.tyear_id \
        FROM input_rows \
        JOIN tyear AS t \
        USING (tyear);",
      values: [release.year],
    };
    const { tyear_id } = (await pool.query(insertYearQuery)).rows[0];

    const insertLabelQuery = {
      text:
        "WITH \
          input_rows (name) AS ( \
            VALUES ($1) \
          ), \
          \
          ins AS ( \
            INSERT INTO label (name) \
            SELECT name \
            FROM input_rows \
            ON CONFLICT DO NOTHING \
            RETURNING label_id \
          ) \
          \
        SELECT label_id \
        FROM ins \
        \
        UNION ALL \
        \
        SELECT l.label_id \
        FROM input_rows \
        JOIN label AS l \
        USING (name);",
      values: [release.label],
    };
    const { label_id } = (await pool.query(insertLabelQuery)).rows[0];

    const insertReleaseArtist = {
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
          SELECT a.artist_id \
          FROM input_rows \
          JOIN artist AS a \
          USING (name);",
      values: [release.artist],
    };
    const { artist_id } = (await pool.query(insertReleaseArtist)).rows[0];

    client.query("BEGIN");

    const insertReleaseQuery = {
      text:
        "WITH \
          input_rows (tyear_id, label_id, cat_no, title, cover_path, artist_id) AS ( \
            VALUES ($1::integer, $2::integer, $3, $4, $5, $6::integer) \
          ), \
          \
          ins AS ( \
            INSERT INTO release (tyear_id, label_id, cat_no, title, cover_path, artist_id) \
            SELECT tyear_id, label_id, cat_no, title, cover_path, artist_id \
            FROM input_rows \
            ON CONFLICT DO NOTHING \
            RETURNING release_id \
          ) \
        \
        SELECT release_id \
        FROM ins \
        \
        UNION ALL \
        \
        SELECT r.release_id \
        FROM input_rows \
        JOIN release AS r \
        USING (cat_no);",
      values: [
        tyear_id,
        label_id,
        release.catNo,
        release.title,
        release.coverPath,
        artist_id,
      ],
    };
    const { release_id } = (await pool.query(insertReleaseQuery)).rows[0];

    await client.query("COMMIT");

    release.setId(release_id);
    return release;
  } catch (err) {
    await client.query("ROLLBACK");
    const text = `Can't create release: ${err.stack}`;
    logger.error(text);
    throw new DBError(err.code, err);
  }
}

export async function read(id: unknown) {
  const validatedId: number = await schemaId.validateAsync(id);
  const pool = await connectDB();

  try {
    const getReleaseTextQuery = {
      text: "SELECT * FROM view_release WHERE id=$1",
      values: [validatedId],
    };
    const releaseMetadata = (await pool.query(getReleaseTextQuery)).rows[0];

    if (!releaseMetadata) return null;
    const release = new Release(releaseMetadata);
    logger.debug(`filePath: ${__filename} \n${util.inspect(release)}`);
    return release;
  } catch (err) {
    logger.error(`${__filename}: Error while reading a release.\n${err.stack}`);
    throw err;
  }
}

export async function readByReleaseId(releaseId: unknown) {
  const validatedReleaseId: number = await schemaId.validateAsync(releaseId);
  const pool = await connectDB();

  try {
    const getTracksTextQuery = {
      text:
        'SELECT * FROM view_track WHERE "releaseId"=$1 ORDER BY "trackNo", "diskNo";',
      values: [validatedReleaseId],
    };
    const { rows } = await pool.query(getTracksTextQuery);

    if (rows.length === 0) throw new HttpError(404);
    const tracks = rows.map((row) => new Track(row));
    logger.debug(`filePath: ${__filename} \n${util.inspect(tracks)}`);
    return { tracks };
  } catch (err) {
    const text = `${__filename}: Error while reading tracks by release id.\n${err.stack}`;
    logger.error(text);
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
    const readReleasesQuery = {
      text: `
        SELECT \
        (SELECT COUNT (*) FROM view_release_short)::integer AS total_count, \
        (SELECT json_agg(t.*) FROM \
          (SELECT * FROM view_release_short \
           ORDER BY \
             CASE WHEN $1 = 'asc' THEN "${sortBy}" END ASC, \
             CASE WHEN $1 = 'asc' THEN 'id' END ASC, \
             CASE WHEN $1 = 'desc' THEN "${sortBy}" END DESC, \
             CASE WHEN $1 = 'desc' THEN 'id' END DESC \
           LIMIT $3::integer \
           OFFSET ($2::integer - 1) * $3::integer \          
           ) AS t) \
        AS releases;
        `,
      values: [sortOrder, page, itemsPerPage],
    };

    const collection: {
      releases: ReleaseShortMetadata[] | null;
      total_count: number;
    } = (await pool.query(readReleasesQuery)).rows[0];

    const releases = collection.releases
      ? collection.releases.map((row) => new ReleaseShort(row))
      : [];
    const { total_count }: { total_count: number } = collection;

    return { items: releases, totalCount: total_count };
  } catch (err) {
    logger.error(`Can't read releases names: ${err.stack}`);
    throw err;
  }
}

/* Implement thuis function. Update ONLY release itself. If catNo exists return err*/
export async function update(metadata: unknown) {
  console.log(metadata);
  // Change to APIRelease or smth like that, we need to create release ntot a track
  //const releaseId = await schemaId.validateAsync(metadata);
  //const track = new APITrack({id: releaseId, ...validatedMetadata)};

  const pool = await connectDB();
  const client = await pool.connect();
  /*
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

    const text = `${__filename}: ROLLBACK.\nError occured while updating track "${track.filePath}" in database.\n${err.stack}`;
    logger.error(text);

    throw new DBError(err.code, err);
  } finally {
    client.release();
  }
  */
}

// FIX: Check whether release tracks deleted. Propbably you can copy code from lolcal... delete queries - they will delete tracks cascadingly
export async function destroy(releaseId: unknown) {
  const validatedReleaseId: number = await schemaId.validateAsync(releaseId);
  const pool = await connectDB();
  const client = await pool.connect();

  try {
    const deleteReleaseQuery = {
      // Delete RELEASE ( + corresponding records in linking tables track_genre and track_artist cascadingly)
      text:
        "DELETE FROM release \
         WHERE release_id = $1 \
         RETURNING release_id",
      values: [validatedReleaseId],
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
      // track_artist
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
    const deletedReleaseId: number = (await client.query(deleteReleaseQuery))
      .rows[0];
    await client.query(deleteYearQuery);
    await client.query(deleteLabelQuery);
    await client.query(deleteExtensionQuery);
    await client.query(deleteGenreQuery);
    await client.query(deleteArtistQuery);
    await client.query("COMMIT");
    return deletedReleaseId;
  } catch (err) {
    await client.query("ROLLBACK");
    const text = `filePath: ${__filename}: Rollback. Can't delete track. Track doesn't exist or an error occured during deletion\n${err.stack}`;
    logger.error(text);
    throw err;
  } finally {
    client.release();
  }
}
