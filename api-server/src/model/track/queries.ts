import util from "util";

import { logger } from "../../config/loggerConf";
import { Track } from "./Track";
import { connectDB } from "../postgres";
import { validationSchema } from "./validationSchema";
import { TrackMetadata } from "../../types";
import { Validator } from "./../../utility/Validator";

type ReturnTrack = Promise<Track>;
type ReturnTracks = Promise<{ tracks: Track[] }>;

export async function create(metadata: TrackMetadata): ReturnTrack {
  const pool = await connectDB();
  const client = await pool.connect();

  await new Validator(validationSchema).validate(metadata);
  const track = new Track(metadata);

  try {
    await client.query("BEGIN");

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
      values: [track.year],
    };
    const { tyear_id } = (await client.query(insertYearQuery)).rows[0];

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
      values: [track.label],
    };
    const { label_id } = (await client.query(insertLabelQuery)).rows[0];

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
          tyear_id, \
          extension_id, \
          label_id, \
          album, \
          disk_no, \
          track_no, \
          title, \
          bitrate, \
          duration, \
          picture_path, \
          file_path \
        ) \
        VALUES (\
          $1::integer, \
          $2::integer, \
          $3::integer, \
          $4, \
          $5::smallint, \
          $6::smallint, \
          $7, \
          $8::numeric, \
          $9::numeric, \
          $10, \
          $11 \
        ) \
        RETURNING track_id",
      values: [
        tyear_id,
        extension_id,
        label_id,
        track.album,
        track.diskNo,
        track.trackNo,
        track.title,
        track.bitrate,
        track.duration,
        track.picturePath,
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

    const text = `filePath: ${__filename}: Rollback.\nError occured while adding track "${track.filePath}" to database.\n${err.stack}`;
    logger.error(text);
    throw err;
  } finally {
    client.release();
  }
}

export async function update(id: number, metadata: TrackMetadata): ReturnTrack {
  const pool = await connectDB();
  const client = await pool.connect();

  await new Validator(validationSchema).validate(metadata as TrackMetadata);
  const track = new Track(metadata as TrackMetadata);

  try {
    await client.query("BEGIN");

    const updateYearQuery = {
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
        SELECT tyear_id \
        FROM ins \
        \
        UNION ALL \
        \
        SELECT t.tyear_id \
        FROM input_rows \
        JOIN tyear AS t \
        USING (tyear);",
      values: [track.year],
    };
    const { tyear_id } = (await client.query(updateYearQuery)).rows[0];

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

    const updateLabelQuery = {
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
        SELECT label_id FROM ins \
        \
        UNION ALL \
        \
        SELECT l.label_id \
        FROM input_rows \
        JOIN label AS l \
        USING (name);",
      values: [track.label],
    };
    const { label_id } = (await client.query(updateLabelQuery)).rows[0];

    const updateTrackQuery = {
      text:
        "UPDATE track \
        SET tyear_id = $1::integer, \
            label_id = $2::integer, \
            extension_id = $3::integer, \
            album = $4, \
            disk_no = $5::smallint, \
            track_no = $6::smallint, \
            title = $7, \
            bitrate = $8::numeric, \
            duration = $9::numeric, \
            picture_path = $10, \
            file_path = $11 \
        WHERE track_id = $12 RETURNING *;",
      values: [
        tyear_id,
        label_id,
        extension_id,
        track.album,
        track.diskNo,
        track.trackNo,
        track.title,
        track.bitrate,
        track.duration,
        track.picturePath,
        track.filePath,
        id,
      ],
    };
    const { track_id } = (await client.query(updateTrackQuery)).rows[0];

    //
    // Update Genre(s) - TODO: do the same you did with "Update Artist"
    //

    // Delete records (referencing the track) from linking table "track_genre"
    const deleteGenresFromLinkingTableQuery = {
      text: "DELETE FROM track_genre WHERE track_id = $1;",
      values: [id],
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
        values: [track_id, genre_id],
      };
      await client.query(inserTrackGenreQuery);
    }
    // Perform cleanup: delete GEBRE record if it is not referenced by any records in track_artist linking table
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
      values: [id],
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
        values: [track_id, artist_id],
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
           NOT IN (SELECT artist_id FROM track_artist) \
         )",
    };
    await client.query(deleteUnreferencedArtistsQuery);

    await client.query("COMMIT");
    track.setTrackId(track_id);
    return track;
  } catch (err) {
    await client.query("ROLLBACK");

    const text = `${__filename}: ROLLBACK.\nError occured while updating track "${track.filePath}" in database.\n${err.stack}`;
    logger.error(text);
    throw err;
  } finally {
    client.release();
  }
}

export async function read(id: number): Promise<Track | null> {
  const pool = await connectDB();

  try {
    const getTrackTextQuery = {
      text: 'SELECT * FROM view_track WHERE "trackId"=$1',
      values: [id],
    };
    const trackMetadata = (await pool.query(getTrackTextQuery)).rows[0];

    if (!trackMetadata) return null;
    const track = new Track(trackMetadata);
    logger.debug(`filePath: ${__filename} \n${util.inspect(track)}`);
    return track;
  } catch (err) {
    const text = `${__filename}: Error while reading a track.\n${err.stack}`;
    logger.error(text);
    throw err;
  }
}

export async function readAll(): ReturnTracks {
  const pool = await connectDB();

  try {
    const getAllTracksTextQuery = { text: "SELECT * FROM view_track" };
    const { rows } = await pool.query(getAllTracksTextQuery);
    logger.debug(rows);
    const tracks = rows.map((row) => new Track(row));
    return { tracks };
  } catch (err) {
    const str = `${__filename}: Error while retrieving all tracks without(!) pagination.\n${err.stack}`;
    logger.error(str);
    throw err;
  }
}

export async function readAllByPages(
  page: number = 1,
  itemsPerPage: number = 10,
): ReturnTracks {
  const pool = await connectDB();

  try {
    const retrieveAllTracksTextQuery = {
      text:
        "SELECT * \
         FROM track \
         LIMIT $2::integer \
         OFFSET ($1::integer - 1) * $2::integer",
      values: [page, itemsPerPage],
    };

    const { rows } = await pool.query(retrieveAllTracksTextQuery);
    const tracks = rows.map((row) => new Track(row));
    logger.debug(rows);
    return { tracks };
  } catch (err) {
    const text = `filePath: ${__filename}: Error while retrieving all tracks with pagination.\n${err.stack}`;
    logger.error(text);
    throw err;
  }
}

export async function destroy(id: number): Promise<number> {
  const pool = await connectDB();
  const client = await pool.connect();

  try {
    const deleteTrackQuery = {
      // Delete TRACK and corresponding records in track_genre and track_artist
      text: "DELETE FROM track WHERE track_id = $1 RETURNING track_id",
      values: [id],
    };

    const deleteYearQuery = {
      // Delete YEAR record if it is not referenced by any records in 'track'
      // Subquery returns table containing 'tyear_id' of the year that is not
      // referenced by any other tables. If there is no such year, no error is
      // thrown, just 'DELETE 0'
      text:
        "DELETE FROM tyear \
        WHERE tyear_id IN ( \
          SELECT tyear_id \
          FROM tyear \
          WHERE tyear_id \
          NOT IN (SELECT tyear_id FROM track) \
        )",
    };

    const deleteLabelQuery = {
      // Delete LABEL record if it is not referenced by any records in 'track'
      text:
        "DELETE FROM label \
        WHERE label_id IN ( \
          SELECT label_id \
          FROM label \
          WHERE label_id \
          NOT IN (SELECT label_id FROM track) \
        )",
    };

    const deleteExtensionQuery = {
      // Delete EXTENSION record if it is not referenced by any records in 'track'
      text:
        "DELETE FROM extension \
         WHERE extension_id IN ( \
           SELECT extension_id \
           FROM extension \
           WHERE extension_id \
           NOT IN (SELECT extension_id FROM track) \
         )",
    };

    const deleteGenreQuery = {
      // Delete GENRE record if it is not referenced by any records in track_genre \
      text:
        "DELETE FROM genre \
         WHERE genre_id IN ( \
           SELECT genre_id \
           FROM genre \
           WHERE genre_id \
           NOT IN (SELECT genre_id FROM track_genre) \
         )",
    };

    const deleteArtistQuery = {
      // Delete ARTIST record if it is not referenced by any records in track_artist
      text:
        "DELETE FROM artist \
         WHERE artist_id IN ( \
           SELECT artist_id \
           FROM artist \
           WHERE artist_id \
           NOT IN (SELECT artist_id FROM track_artist) \
         )",
    };

    await client.query("BEGIN");
    const deletedTrackId = (await client.query(deleteTrackQuery)).rows[0];
    await client.query(deleteYearQuery);
    await client.query(deleteLabelQuery);
    await client.query(deleteExtensionQuery);
    await client.query(deleteGenreQuery);
    await client.query(deleteArtistQuery);
    await client.query("COMMIT");
    return deletedTrackId;
  } catch (err) {
    await client.query("ROLLBACK");
    const text = `filePath: ${__filename}: Rollback. Can't delete track. Track doesn't exist or an error occured during deletion\n${err.stack}`;
    logger.error(text);
    throw err;
  } finally {
    client.release();
  }
}
