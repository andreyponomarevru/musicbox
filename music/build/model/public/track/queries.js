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
exports.destroy = exports.readAll = exports.read = exports.update = exports.create = void 0;
const logger_conf_1 = require("../../../config/logger-conf");
const Track_1 = require("./Track");
const TrackExtended_1 = require("./TrackExtended");
const postgres_1 = require("../../postgres");
const validation_schemas_1 = require("./../validation-schemas");
/*
 * Queries used only by REST API i.e. they are exposed through the controller
 */
function create(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const validatedMetadata = yield validation_schemas_1.schemaCreateTrack.validateAsync(metadata);
        const track = new Track_1.Track(validatedMetadata);
        const pool = yield postgres_1.connectDB();
        const client = yield pool.connect();
        try {
            yield client.query("BEGIN");
            const insertExtensionQuery = {
                text: "WITH \
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
            const { extension_id } = (yield client.query(insertExtensionQuery)).rows[0];
            const insertTrackQuery = {
                text: "INSERT INTO track ( \
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
            const { track_id } = (yield client.query(insertTrackQuery)).rows[0];
            for (const genre of track.genre) {
                const insertGenreQuery = {
                    text: "WITH \
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
                const { genre_id } = (yield client.query(insertGenreQuery)).rows[0];
                const inserTrackGenreQuery = {
                    text: "INSERT INTO track_genre (track_id, genre_id) \
                VALUES ($1::integer, $2::integer) \
           ON CONFLICT DO NOTHING",
                    values: [track_id, genre_id],
                };
                yield client.query(inserTrackGenreQuery);
            }
            for (const artist of track.artist) {
                const insertArtistQuery = {
                    text: "WITH \
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
                const { artist_id } = (yield client.query(insertArtistQuery)).rows[0];
                const inserTrackArtistQuery = {
                    text: "INSERT INTO track_artist (track_id, artist_id) \
                VALUES ($1::integer, $2::integer) \
           ON CONFLICT DO NOTHING",
                    values: [track_id, artist_id],
                };
                yield client.query(inserTrackArtistQuery);
            }
            yield client.query("COMMIT");
            track.setTrackId(track_id);
            return track;
        }
        catch (err) {
            yield client.query("ROLLBACK");
            logger_conf_1.logger.error(`${__filename}: ROLLBACK. Error occured while adding track "${track.filePath}" to database.`);
            throw err;
        }
        finally {
            client.release();
        }
    });
}
exports.create = create;
function update(newMetadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const validatedMetadata = yield validation_schemas_1.schemaUpdateTrack.validateAsync(newMetadata);
        const track = new Track_1.Track(validatedMetadata);
        const pool = yield postgres_1.connectDB();
        const client = yield pool.connect();
        try {
            yield client.query("BEGIN");
            const updateExtensionQuery = {
                text: "WITH \
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
            const { extension_id } = (yield client.query(updateExtensionQuery)).rows[0];
            const updateTrackQuery = {
                text: "UPDATE track \
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
            yield client.query(updateTrackQuery);
            //
            // Update Genre(s)
            //
            // Delete records (referencing the track) from linking table "track_genre"
            const deleteGenresFromLinkingTableQuery = {
                text: "DELETE FROM track_genre WHERE track_id = $1;",
                values: [track.getTrackId()],
            };
            yield client.query(deleteGenresFromLinkingTableQuery);
            // Insert new genres
            for (const genre of track.genre) {
                const insertGenreQuery = {
                    text: "WITH \
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
                const { genre_id } = (yield client.query(insertGenreQuery)).rows[0];
                const inserTrackGenreQuery = {
                    text: "INSERT INTO \
            track_genre (track_id, genre_id) \
           VALUES ($1::integer, $2::integer) \
           ON CONFLICT DO NOTHING",
                    values: [track.getTrackId(), genre_id],
                };
                yield client.query(inserTrackGenreQuery);
            }
            // Perform cleanup: delete GENRE record if it is not referenced by any records in track_artist linking table
            const deleteUnreferencedGenresQuery = {
                text: "DELETE FROM genre \
         WHERE genre_id IN ( \
           SELECT genre_id \
           FROM genre \
           WHERE genre_id \
           NOT IN (SELECT genre_id FROM track_genre) \
         )",
            };
            yield client.query(deleteUnreferencedGenresQuery);
            //
            // Update Artist(s)
            //
            // Delete records (referencing the track) from linking table "track_artist"
            const deleteArtistsFromLinkingTableQuery = {
                text: "DELETE FROM track_artist WHERE track_id = $1;",
                values: [track.getTrackId()],
            };
            yield client.query(deleteArtistsFromLinkingTableQuery);
            // Insert new artists
            for (const artist of track.artist) {
                const insertArtistQuery = {
                    text: "WITH \
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
                const { artist_id } = (yield client.query(insertArtistQuery)).rows[0];
                const inserTrackArtistQuery = {
                    text: "INSERT INTO track_artist (track_id, artist_id) \
             VALUES ($1::integer, $2::integer) \
           ON CONFLICT DO NOTHING",
                    values: [track.getTrackId(), artist_id],
                };
                yield client.query(inserTrackArtistQuery);
            }
            // Perform cleanup: delete ARTIST record if it is not referenced by any records in track_artist linking table
            const deleteUnreferencedArtistsQuery = {
                text: "DELETE FROM artist \
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
            yield client.query(deleteUnreferencedArtistsQuery);
            yield client.query("COMMIT");
            console.log(track);
            return track;
        }
        catch (err) {
            yield client.query("ROLLBACK");
            logger_conf_1.logger.error(`${__filename}: ROLLBACK. Error occured while updating track "${track.filePath}" in database.`);
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
        const validatedId = yield validation_schemas_1.schemaId.validateAsync(id);
        const pool = yield postgres_1.connectDB();
        try {
            const getTrackTextQuery = {
                text: 'SELECT * FROM view_track WHERE "trackId"=$1',
                values: [validatedId],
            };
            const trackMetadata = (yield pool.query(getTrackTextQuery)).rows[0];
            return trackMetadata ? new TrackExtended_1.TrackExtended(trackMetadata) : null;
        }
        catch (err) {
            logger_conf_1.logger.error(`${__filename}: Error while reading a track.`);
            throw err;
        }
    });
}
exports.read = read;
function readAll(params) {
    return __awaiter(this, void 0, void 0, function* () {
        let { sortBy, sortOrder, page, itemsPerPage, } = yield validation_schemas_1.schemaSortAndPaginate.validateAsync(params);
        logger_conf_1.logger.debug(`sortBy: ${sortBy} sortOrder: ${sortOrder}, page: ${page}, itemsPerPage: ${itemsPerPage}`);
        const pool = yield postgres_1.connectDB();
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
            const collection = (yield pool.query(readTracksQuery)).rows[0];
            const tracks = collection.tracks
                ? collection.tracks.map((row) => new TrackExtended_1.TrackExtended(row))
                : [];
            const total_count = collection.total_count;
            return { items: tracks, totalCount: total_count };
        }
        catch (err) {
            logger_conf_1.logger.error(`${__filename}: Error while retrieving all tracks with pagination.\n${err.stack}`);
            throw err;
        }
    });
}
exports.readAll = readAll;
function destroy(trackId) {
    return __awaiter(this, void 0, void 0, function* () {
        const validatedTrackId = yield validation_schemas_1.schemaId.validateAsync(trackId);
        const pool = yield postgres_1.connectDB();
        const client = yield pool.connect();
        try {
            const deleteTrackQuery = {
                // Delete TRACK ( + corresponding records in track_genre and track_artist cascadingly)
                text: "DELETE FROM track \
         WHERE track_id = $1 \
         RETURNING track_id",
                values: [validatedTrackId],
            };
            // Try to delete the RELEASE if no other tracks reference it
            const deleteReleaseQuery = {
                text: "DELETE FROM release \
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
                text: "DELETE FROM tyear \
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
                text: "DELETE FROM label \
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
                text: "DELETE FROM extension \
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
                text: "DELETE FROM genre \
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
                text: "DELETE FROM artist \
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
            yield client.query("BEGIN");
            const deletedTrackId = (yield client.query(deleteTrackQuery))
                .rows[0];
            yield client.query(deleteReleaseQuery);
            yield client.query(deleteYearQuery);
            yield client.query(deleteLabelQuery);
            yield client.query(deleteExtensionQuery);
            yield client.query(deleteGenreQuery);
            yield client.query(deleteArtistQuery);
            yield client.query("COMMIT");
            return deletedTrackId;
        }
        catch (err) {
            yield client.query("ROLLBACK");
            logger_conf_1.logger.error(`${__filename}: ROLLBACK. Can't delete track. Track doesn't exist or an error occured during deletion.`);
            throw err;
        }
        finally {
            client.release();
        }
    });
}
exports.destroy = destroy;
//# sourceMappingURL=queries.js.map