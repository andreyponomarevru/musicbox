const { Pool } = require("pg");
const logger = require("../../utility/loggerConf.js");
const Track = require("./TrackModel.js");
const validate = require("./validate.js");
const validationSchema = require("./validationSchema.js");

const {
  POSTGRES_USER: user,
  POSTGRES_PASSWORD: password,
  POSTGRES_HOST: host,
  POSTGRES_DATABASE: database,
  POSTGRES_PORT: port,
} = process.env;
let pool;

async function connectDB() {
  if (pool) {
    return pool;
  } else {
    pool = new Pool({ user, host, database, password, port });
    return pool;
  }
}

async function create(metadata) {
  const pool = await connectDB();
  const client = await pool.connect();

  const validatedData = await validate(metadata, validationSchema);
  const track = new Track(validatedData);

  logger.info(track);

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
    //logger.debug(`tyear_id: ${tyear_id}`);

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
    //logger.debug(`extension_id: ${extension_id}`);

    //

    const insertTrackText =
      "INSERT INTO track \
        (tyear_id, extension_id, album, disk_no, track_no, title, bitrate, \
         duration, file_path) \
      VALUES \
        ($1::integer, $2::integer, $3, $4::smallint, $5::smallint, $6, \
         $7::numeric, $8::numeric, $9) \
      ON CONFLICT DO NOTHING \
      RETURNING track_id";
    // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
    const { track_id } = (
      await client.query(insertTrackText, [
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

    for (let genre of track.genre) {
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
      await client.query(insertArtistText, [track.artist])
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
    //logger.debug(`label_id: ${label_id}`);

    const inserTrackLabelText =
      "INSERT INTO track_label \
        (track_id, label_id) \
       VALUES \
        ($1::integer, $2::integer) \
      ON CONFLICT DO NOTHING";
    // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
    await client.query(inserTrackLabelText, [track_id, label_id]);

    //

    await client.query("COMMIT");
    return track;
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(
      `${__filename}: ROLLBACK.\nError occured while adding track "${track.filePath}" to database.\n${err}`,
    );
    process.exit(1);
  } finally {
    client.release();
  }
}

async function update(id, metadata) {
  const pool = await connectDB();
  const client = await pool.connect();

  const validatedData = await validate(metadata);
  const track = new Track(validatedData);

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

    for (let genre of track.genre) {
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
    logger.error(
      `${__filename}: ROLLBACK.\nError occured while updating track "${track.filePath}" in database.\n${err}`,
    );
    // process.exit(1);
  } finally {
    client.release();
  }
}

async function read(id) {
  const pool = await connectDB();
  try {
    const getTrackText = "SELECT * \
      FROM track \
      WHERE track_id=$1";

    const track = (await pool.query(getTrackText, [id])).rows[0];
    logger.debug(`filePath: ${track.filePath}
      year: ${track.year}
      extension: ${track.extension}
      artist: ${track.artist}
      duration: ${track.duration}
      bitrate: ${track.bitrate}
      trackNo: ${track.trackNo}
      title: ${track.title}
      album: ${track.album}
      diskNo: ${track.diskNo}
      label: ${track.label}
      genre: ${track.genre}`);
    /*
    return new Track({
      filePath: track.filePath,
      year: track.year,
      extension: track.extension,
      artist: track.artist,
      duration: track.duration,
      bitrate: track.bitrate,
      trackNo: track.trackNo,
      title: track.title,
      album: track.album,
      diskNo: track.diskNo,
      label: track.label,
      genre: track.genre,
    });
    */
    logger.info(track);
    // return <array ob Track objects>
  } catch (err) {
    logger.error(`${__filename}: Error while reading a track.\n${err}`);
  }
}

async function readAll() {
  const pool = await connectDB();
  try {
    const getAllTracksText = "SELECT * FROM track";
    const { rows } = await pool.query(getAllTracksText);

    // TODO: for each row (i.e. track) create a new obj: new Track(row props) and return an array of these objects
    logger.info(rows);
    // return
  } catch (err) {
    logger.error(
      `${__filename}: Error while retrieving all tracks without(!) pagination.\n${err}`,
    );
  }
}

async function readAllByPages(page) {
  const pool = await connectDB();
  try {
    // TODO: get `page` variable (i.e. function argument) from route:
    // for example /api/items/:page

    // TODO: allow the clients to specify it through a query ?items=50 or the
    // request body or a header or however you want
    const itemsPerPage = 10;

    const retrieveAllTracksText =
      "SELECT * \
       FROM track \
       LIMIT $2::integer \
       OFFSET ($1::integer - 1) * $2::integer";

    const { rows } = await pool.query(retrieveAllTracksText, [
      page,
      itemsPerPage,
    ]);
    // TODO: for each row (i.e. track) create a new obj: new Track(row props) and return an array of these objects
    logger.info(rows);
    // return
  } catch (err) {
    logger.error(
      `${__filename}: Error while retrieving all tracks with pagination.\n${err}`,
    );
  }
}

async function destroy(id) {
  const pool = await connectDB();
  try {
    const deleteTrackText =
      "DELETE FROM track \
      WHERE track_id=$1 \
      RETURNING *";
    const deletedTrack = (await pool.query(deleteTrackText, [id])).rows[0];

    // TODO: try to delete tyear, extension, artist (+track_artist), genre (+track_genre), label (+track_label)

    // create a return not 'deletedTrack' but `new Track(delete track props)`
    return deletedTrack;
  } catch (err) {
    logger.error(`${__filename}: Can't delete track.\n${err}`);
  }
}

async function count() {
  const pool = await connectDB();
  try {
    const countTracksText = "SELECT COUNT(*) FROM track";
    const { count } = (await pool.query(countTracksText)).rows[0];
    return count;
  } catch (err) {
    logger.error(`${__filename}: Can't count the number of tracks.\n${err}`);
  }
}

async function close() {
  if (pool) await pool.end();
  pool = undefined;
  logger.debug("Pool has ended");
}

module.exports.create = create;
module.exports.update = update;
module.exports.read = read;
module.exports.readAll = readAll;
module.exports.destroy = destroy;
module.exports.count = count;
module.exports.readAll = readAll;
module.exports.readAllByPages = readAllByPages;
module.exports.close = close;
