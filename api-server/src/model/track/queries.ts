import { logger } from "../../config/loggerConf";
import { Track } from "./Track";
import { connectDB } from "../postgres";
import { validationSchema } from "./validationSchema";
import { TrackMetadata } from "../../types";
import { Validator } from "./../../utility/Validator";

export async function create(metadata: unknown): Promise<Track> {
  const pool = await connectDB();
  const client = await pool.connect();

  await new Validator(validationSchema).validate(metadata as TrackMetadata);
  const track = new Track(metadata as TrackMetadata);

  try {
    await client.query("BEGIN");

    const insertYearText =
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
      USING (tyear);";
    const { tyear_id } = (
      await client.query(insertYearText, [track.year])
    ).rows[0];

    //

    const insertLabelText =
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
      USING (name);";
    const { label_id } = (
      await client.query(insertLabelText, [track.label])
    ).rows[0];

    //

    const insertExtensionText =
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
      USING (name);";
    const { extension_id } = (
      await client.query(insertExtensionText, [track.extension])
    ).rows[0];

    //

    const insertTrackText =
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
        $10 \
      ) \
      ON CONFLICT DO NOTHING \
      RETURNING track_id";
    // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
    const { track_id } = (
      await client.query(insertTrackText, [
        tyear_id,
        extension_id,
        label_id,
        track.album,
        track.diskNo,
        track.trackNo,
        track.title,
        track.bitrate,
        track.duration,
        track.filePath,
      ])
    ).rows[0];

    //

    for (const genre of track.genre) {
      const insertGenreText =
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
        USING (name);";
      const { genre_id } = (
        await client.query(insertGenreText, [genre])
      ).rows[0];

      const inserTrackGenreText =
        "INSERT INTO track_genre \
          (track_id, genre_id) \
         VALUES \
          ($1::integer, $2::integer) \
        ON CONFLICT DO NOTHING";
      // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
      await client.query(inserTrackGenreText, [track_id, genre_id]);
    }

    //

    for (const artist of track.artist) {
      const insertArtistText =
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
        USING (name);";

      const { artist_id } = (
        await client.query(insertArtistText, [artist])
      ).rows[0];
      //logger.debug(`artist_id: ${artist_id}`);

      const inserTrackArtistText =
        "INSERT INTO track_artist \
          (track_id, artist_id) \
        VALUES \
          ($1::integer, $2::integer) \
        ON CONFLICT DO NOTHING";
      // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
      await client.query(inserTrackArtistText, [track_id, artist_id]);
    }

    await client.query("COMMIT");
    return track;
  } catch (err) {
    await client.query("ROLLBACK");

    const text = `${__dirname}/${__filename}: ROLLBACK.\nError occured while adding track "${track.filePath}" to database.\n${err.stack}`;
    logger.error(text);
    throw err;
  } finally {
    client.release();
  }
}

export async function update(
  id: number,
  metadata: TrackMetadata,
): Promise<Track> {
  const pool = await connectDB();
  const client = await pool.connect();

  await new Validator(validationSchema).validate(metadata as TrackMetadata);
  const track = new Track(metadata as TrackMetadata);

  try {
    await client.query("BEGIN");

    const updateYearText =
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
      USING (tyear);";
    const { tyear_id } = (
      await client.query(updateYearText, [track.year])
    ).rows[0];
    //logger.debug(`tyear_id: ${tyear_id}`);

    //

    const updateExtensionText =
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
      USING (name);";
    const { extension_id } = (
      await client.query(updateExtensionText, [track.extension])
    ).rows[0];
    //logger.debug(`extension_id: ${extension_id}`);

    //

    const updateTrackText =
      "INSERT INTO track \
        (tyear_id, extension_id, album, disk_no, track_no, title, bitrate, \
         duration, file_path) \
      VALUES \
        ($1::integer, $2::integer, $3, $4::smallint, $5::smallint, $6, \
         $7::numeric, $8::numeric, $9) \
      ON CONFLICT (file_path) DO UPDATE \
      SET file_path = $9 \
      RETURNING *";
    // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
    const { track_id } = (
      await client.query(updateTrackText, [
        tyear_id,
        extension_id,
        track.album,
        track.diskNo,
        track.trackNo,
        track.title,
        track.bitrate,
        track.duration,
        track.filePath,
      ])
    ).rows[0];
    //logger.debug(`track_id: ${track_id}`);

    //

    for (const genre of track.genre) {
      const updateGenreText =
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
        SELECT g.genre_id \
        FROM input_rows \
        JOIN genre AS g \
        USING (name);";
      const { genre_id } = (
        await client.query(updateGenreText, [genre])
      ).rows[0];
      //logger.debug(`genre_id: ${genre_id}`);

      const inserTrackGenreText =
        "INSERT INTO track_genre \
          (track_id, genre_id) \
         VALUES \
          ($1::integer, $2::integer) \
         ON CONFLICT DO NOTHING";
      // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
      await client.query(inserTrackGenreText, [track_id, genre_id]);
    }

    //

    const updateArtistText =
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
      USING (name);";
    const { artist_id } = (
      await client.query(updateArtistText, [track.artist])
    ).rows[0];
    //logger.debug(`artist_id: ${artist_id}`);

    const updateTrackArtistText =
      "INSERT INTO track_artist \
        (track_id, artist_id) \
       VALUES \
        ($1::integer, $2::integer) \
       ON CONFLICT DO NOTHING";
    // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
    await client.query(updateTrackArtistText, [track_id, artist_id]);

    //

    const updateLabelText =
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
      USING (name);";
    const { label_id } = (
      await client.query(updateLabelText, [track.label])
    ).rows[0];
    //logger.debug(`label_id: ${label_id}`);

    const updateTrackLabelText =
      "INSERT INTO track_label \
        (track_id, label_id) \
       VALUES \
        ($1::integer, $2::integer) \
       ON CONFLICT DO NOTHING";
    // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
    await client.query(updateTrackLabelText, [track_id, label_id]);

    //

    await client.query("COMMIT");
    return track;
  } catch (err) {
    await client.query("ROLLBACK");

    const text = `${__dirname}/${__filename}: ROLLBACK.\nError occured while updating track "${track.filePath}" in database.\n${err.stack}`;
    logger.error(text);
    throw err;
  } finally {
    client.release();
  }
}

export async function read(id: number): Promise<Track> {
  const pool = await connectDB();

  try {
    const getTrackText = "SELECT * FROM view_track WHERE track_id=$1";
    const trackMetadata = (await pool.query(getTrackText, [id])).rows[0];
    const track = new Track(trackMetadata);
    logger.debug(`filePath: ${track.filePath} \n${track}`);

    return track;
  } catch (err) {
    const text = `${__dirname}/${__filename}: Error while reading a track.\n${err.stack}`;
    logger.error(text);
    throw err;
  }
}

export async function readAll(): Promise<{ tracks: Track[] }> {
  const pool = await connectDB();

  try {
    const getAllTracksText = "SELECT * FROM view_track";
    const { rows } = await pool.query(getAllTracksText);
    // logger.info(rows);
    // TODO: for each row (i.e. track) create a new obj: new Track(row props) and return an array of these Track objects
    const tracks = rows.map((row) => new Track(row));
    return { tracks };
  } catch (err) {
    const str = `${__filename}: Error while retrieving all tracks without(!) pagination.\n${err.stack}`;
    logger.error(str);
    throw err;
  }
}

export async function readAllByPages(
  page: number,
): Promise<{ tracks: Track[] }> {
  const pool = await connectDB();
  try {
    // TODO: get `page` variable (i.e. function argument) from route:
    // for example /api/items/:page

    // TODO: allow the clients to specify it through a query ?items=50 or the
    // request body or a header or however you want
    const itemsPerPage = 20;

    const retrieveAllTracksText =
      "SELECT * \
       FROM track \
       LIMIT $2::integer \
       OFFSET ($1::integer - 1) * $2::integer";

    const { rows } = await pool.query(retrieveAllTracksText, [
      page,
      itemsPerPage,
    ]);

    const tracks = rows.map((row) => new Track(row));

    logger.debug(rows);
    return { tracks };
  } catch (err) {
    const text = `${__dirname}/${__filename}: Error while retrieving all tracks with pagination.\n${err.stack}`;
    logger.error(text);
    throw err;
  }
}

export async function destroy(id: number): Promise<Track> {
  const pool = await connectDB();
  try {
    const deleteTrackText =
      "DELETE FROM track \
      WHERE track_id=$1 \
      RETURNING *";
    const deletedTrack = (await pool.query(deleteTrackText, [id])).rows[0];

    // TODO: try to delete tyear, extension, artist (+track_artist), genre (+track_genre), label (+track_label)
    const track = new Track(deletedTrack);
    return track;
  } catch (err) {
    const text = `${__filename}: Can't delete track.\n${err.stack}`;
    logger.error(text);
    throw err;
  }
}

export async function count(): Promise<{ tracks: number }> {
  const pool = await connectDB();
  try {
    const countTracksText = "SELECT COUNT(*) FROM track";
    const { count } = (await pool.query(countTracksText)).rows[0];
    return { tracks: count };
  } catch (err) {
    const text = `${__dirname}/${__filename}: Can't count the number of tracks.\n${err.stack}`;
    logger.error(text);
    throw err;
  }
}
