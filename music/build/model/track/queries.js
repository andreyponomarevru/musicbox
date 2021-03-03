"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.destroy = exports.readAllByPages = exports.readAll = exports.read = exports.update = exports.create = void 0;
const loggerConf_1 = require("../../config/loggerConf");
const Track_1 = require("./Track");
const postgres_1 = require("../postgres");
const validationSchema_1 = require("./validationSchema");
const Validator_1 = require("./../../utility/Validator");
function create(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        const client = yield pool.connect();
        yield new Validator_1.Validator(validationSchema_1.validationSchema).validate(metadata);
        const track = new Track_1.Track(metadata);
        //logger.info(track);
        try {
            yield client.query("BEGIN");
            const insertYearText = "WITH \
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
            const { tyear_id } = (yield client.query(insertYearText, [track.year])).rows[0];
            //
            const insertLabelText = "WITH \
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
            const { label_id } = (yield client.query(insertLabelText, [track.label])).rows[0];
            //
            const insertExtensionText = "WITH \
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
            const { extension_id } = (yield client.query(insertExtensionText, [track.extension])).rows[0];
            //
            const insertTrackText = "INSERT INTO track ( \
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
            const { track_id } = (yield client.query(insertTrackText, [
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
            ])).rows[0];
            //
            for (const genre of track.genre) {
                const insertGenreText = "WITH \
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
                const { genre_id } = (yield client.query(insertGenreText, [genre])).rows[0];
                const inserTrackGenreText = "INSERT INTO track_genre \
          (track_id, genre_id) \
         VALUES \
          ($1::integer, $2::integer) \
        ON CONFLICT DO NOTHING";
                // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
                yield client.query(inserTrackGenreText, [track_id, genre_id]);
            }
            //
            for (const artist of track.artist) {
                const insertArtistText = "WITH \
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
                const { artist_id } = (yield client.query(insertArtistText, [artist])).rows[0];
                //logger.debug(`artist_id: ${artist_id}`);
                const inserTrackArtistText = "INSERT INTO track_artist \
          (track_id, artist_id) \
        VALUES \
          ($1::integer, $2::integer) \
        ON CONFLICT DO NOTHING";
                // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
                yield client.query(inserTrackArtistText, [track_id, artist_id]);
            }
            yield client.query("COMMIT");
            return track;
        }
        catch (err) {
            yield client.query("ROLLBACK");
            const text = `${__dirname}/${__filename}: ROLLBACK.\nError occured while adding track "${track.filePath}" to database.\n${err.stack}`;
            loggerConf_1.logger.error(text);
            throw err;
        }
        finally {
            client.release();
        }
    });
}
exports.create = create;
function update(id, metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        const client = yield pool.connect();
        const validatedData = yield validate(metadata, validationSchema_1.validationSchema);
        const track = new Track_1.Track(validatedData);
        try {
            yield client.query("BEGIN");
            const updateYearText = "WITH \
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
            const { tyear_id } = (yield client.query(updateYearText, [track.year])).rows[0];
            //logger.debug(`tyear_id: ${tyear_id}`);
            //
            const updateExtensionText = "WITH \
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
            const { extension_id } = (yield client.query(updateExtensionText, [track.extension])).rows[0];
            //logger.debug(`extension_id: ${extension_id}`);
            //
            const updateTrackText = "INSERT INTO track \
        (tyear_id, extension_id, album, disk_no, track_no, title, bitrate, \
         duration, file_path) \
      VALUES \
        ($1::integer, $2::integer, $3, $4::smallint, $5::smallint, $6, \
         $7::numeric, $8::numeric, $9) \
      ON CONFLICT (file_path) DO UPDATE \
      SET file_path = $9 \
      RETURNING *";
            // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
            const { track_id } = (yield client.query(updateTrackText, [
                tyear_id,
                extension_id,
                track.album,
                track.diskNo,
                track.trackNo,
                track.title,
                track.bitrate,
                track.duration,
                track.filePath,
            ])).rows[0];
            //logger.debug(`track_id: ${track_id}`);
            //
            for (const genre of track.genre) {
                const updateGenreText = "WITH \
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
                const { genre_id } = (yield client.query(updateGenreText, [genre])).rows[0];
                //logger.debug(`genre_id: ${genre_id}`);
                const inserTrackGenreText = "INSERT INTO track_genre \
          (track_id, genre_id) \
         VALUES \
          ($1::integer, $2::integer) \
         ON CONFLICT DO NOTHING";
                // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
                yield client.query(inserTrackGenreText, [track_id, genre_id]);
            }
            //
            const updateArtistText = "WITH \
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
            const { artist_id } = (yield client.query(updateArtistText, [track.artist])).rows[0];
            //logger.debug(`artist_id: ${artist_id}`);
            const updateTrackArtistText = "INSERT INTO track_artist \
        (track_id, artist_id) \
       VALUES \
        ($1::integer, $2::integer) \
       ON CONFLICT DO NOTHING";
            // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
            yield client.query(updateTrackArtistText, [track_id, artist_id]);
            //
            const updateLabelText = "WITH \
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
            const { label_id } = (yield client.query(updateLabelText, [track.label])).rows[0];
            //logger.debug(`label_id: ${label_id}`);
            const updateTrackLabelText = "INSERT INTO track_label \
        (track_id, label_id) \
       VALUES \
        ($1::integer, $2::integer) \
       ON CONFLICT DO NOTHING";
            // FIX: remove ON CONFLIC DO NOTHING and implement loading library from database instead of filling tables from scratch each time the app starts
            yield client.query(updateTrackLabelText, [track_id, label_id]);
            //
            yield client.query("COMMIT");
            return track;
        }
        catch (err) {
            yield client.query("ROLLBACK");
            const text = `${__dirname}/${__filename}: ROLLBACK.\nError occured while updating track "${track.filePath}" in database.\n${err.stack}`;
            loggerConf_1.logger.error(text);
            throw err;
        }
        finally {
            client.release();
        }
    });
}
exports.update = update;
function read(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const getTrackText = "SELECT * FROM view_track WHERE track_id=$1";
            const trackMetadata = (yield pool.query(getTrackText, [id])).rows[0];
            const track = new Track_1.Track(trackMetadata);
            loggerConf_1.logger.debug(`filePath: ${track.filePath} \n${track}`);
            return track;
        }
        catch (err) {
            const text = `${__dirname}/${__filename}: Error while reading a track.\n${err.stack}`;
            loggerConf_1.logger.error(text);
            throw err;
        }
    });
}
exports.read = read;
function readAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const getAllTracksText = "SELECT * FROM view_track";
            const { rows } = yield pool.query(getAllTracksText);
            // logger.info(rows);
            // TODO: for each row (i.e. track) create a new obj: new Track(row props) and return an array of these Track objects
            const tracks = rows.map((row) => new Track_1.Track(row));
            return { tracks };
        }
        catch (err) {
            const str = `${__filename}: Error while retrieving all tracks without(!) pagination.\n${err.stack}`;
            loggerConf_1.logger.error(str);
            throw err;
        }
    });
}
exports.readAll = readAll;
function readAllByPages(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            // TODO: get `page` variable (i.e. function argument) from route:
            // for example /api/items/:page
            // TODO: allow the clients to specify it through a query ?items=50 or the
            // request body or a header or however you want
            const itemsPerPage = 20;
            const retrieveAllTracksText = "SELECT * \
       FROM track \
       LIMIT $2::integer \
       OFFSET ($1::integer - 1) * $2::integer";
            const { rows } = yield pool.query(retrieveAllTracksText, [
                page,
                itemsPerPage,
            ]);
            const tracks = rows.map((row) => new Track_1.Track(row));
            loggerConf_1.logger.debug(rows);
            return { tracks };
        }
        catch (err) {
            const text = `${__dirname}/${__filename}: Error while retrieving all tracks with pagination.\n${err.stack}`;
            loggerConf_1.logger.error(text);
            throw err;
        }
    });
}
exports.readAllByPages = readAllByPages;
function destroy(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const deleteTrackText = "DELETE FROM track \
      WHERE track_id=$1 \
      RETURNING *";
            const deletedTrack = (yield pool.query(deleteTrackText, [id])).rows[0];
            // TODO: try to delete tyear, extension, artist (+track_artist), genre (+track_genre), label (+track_label)
            const track = new Track_1.Track(deletedTrack);
            return track;
        }
        catch (err) {
            const text = `${__filename}: Can't delete track.\n${err.stack}`;
            loggerConf_1.logger.error(text);
            throw err;
        }
    });
}
exports.destroy = destroy;
function count() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const countTracksText = "SELECT COUNT(*) FROM track";
            const { count } = (yield pool.query(countTracksText)).rows[0];
            return { tracks: count };
        }
        catch (err) {
            const text = `${__dirname}/${__filename}: Can't count the number of tracks.\n${err.stack}`;
            loggerConf_1.logger.error(text);
            throw err;
        }
    });
}
exports.count = count;
//# sourceMappingURL=queries.js.map