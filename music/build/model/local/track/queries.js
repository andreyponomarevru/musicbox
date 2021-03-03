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
exports.create = void 0;
const logger_conf_1 = require("../../../config/logger-conf");
const postgres_1 = require("../../postgres");
const validation_schemas_1 = require("../validation-schemas");
const TrackExtended_1 = require("./../../public/track/TrackExtended");
/*
 * Queries used only locally (not exposed through the controller), for adding
 * tracks to the database while scanning the local disk i.e. they are not used
 * by public REST API
 */
function create(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const validatedMetadata = yield validation_schemas_1.schemaImportLocalTrack.validateAsync(metadata);
        const track = new TrackExtended_1.TrackExtended(validatedMetadata);
        const pool = yield postgres_1.connectDB();
        const client = yield pool.connect();
        try {
            yield client.query("BEGIN");
            const insertYearQuery = {
                text: "WITH \
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
            const { tyear_id } = (yield client.query(insertYearQuery)).rows[0];
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
            const insertLabelQuery = {
                text: "WITH \
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
            const { label_id } = (yield client.query(insertLabelQuery)).rows[0];
            const insertReleaseArtist = {
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
          SELECT a.artist_id \
          FROM input_rows \
          JOIN artist AS a \
          USING (name);",
                values: [track.releaseArtist],
            };
            const { artist_id: releaseArtistId } = (yield client.query(insertReleaseArtist)).rows[0];
            const insertReleaseQuery = {
                text: "WITH \
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
                    track.catNo,
                    track.releaseTitle,
                    track.coverPath,
                    releaseArtistId,
                ],
            };
            const { release_id } = (yield client.query(insertReleaseQuery)).rows[0];
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
                    release_id,
                    track.diskNo,
                    track.trackNo,
                    track.trackTitle,
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
            for (const trackArtist of track.trackArtist) {
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
                    values: [trackArtist],
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
            track.setReleaseId(release_id);
            return track;
        }
        catch (err) {
            yield client.query("ROLLBACK");
            logger_conf_1.logger.error(`ROLLBACK. Error occured while adding track "${track.filePath}" to database.`);
            throw err;
        }
        finally {
            client.release();
        }
    });
}
exports.create = create;
//# sourceMappingURL=queries.js.map