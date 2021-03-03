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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.update = exports.readAll = exports.readByReleaseId = exports.read = exports.create = exports.find = void 0;
const util_1 = __importDefault(require("util"));
const Track_1 = require("../track/Track");
const logger_conf_1 = require("../../../config/logger-conf");
const postgres_1 = require("../../postgres");
const ReleaseExtended_1 = require("./ReleaseExtended");
const Release_1 = require("./Release");
const validation_schemas_1 = require("../validation-schemas");
/*
 * Queries used only by REST API i.e. they are exposed through the controller
 */
function find(catNo) {
    return __awaiter(this, void 0, void 0, function* () {
        const validCatNo = yield validation_schemas_1.schemaCatNo.validateAsync(catNo);
        const pool = yield postgres_1.connectDB();
        try {
            const findReleaseCatNoQuery = {
                text: "SELECT cat_no FROM release WHERE cat_no = $1",
                values: [validCatNo],
            };
            const { rows } = yield pool.query(findReleaseCatNoQuery);
            return rows;
        }
        catch (err) {
            logger_conf_1.logger.error(`${__filename}: Error while searching for release in database.`);
            throw err;
        }
    });
}
exports.find = find;
function create(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const validMeta = yield validation_schemas_1.schemaCreateRelease.validateAsync(metadata);
        const release = new ReleaseExtended_1.ReleaseExtended(validMeta);
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
                values: [release.year],
            };
            const { tyear_id } = (yield pool.query(insertYearQuery)).rows[0];
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
                values: [release.label],
            };
            const { label_id } = (yield pool.query(insertLabelQuery)).rows[0];
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
                values: [release.artist],
            };
            const { artist_id } = (yield pool.query(insertReleaseArtist)).rows[0];
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
                    release.catNo,
                    release.title,
                    release.coverPath,
                    artist_id,
                ],
            };
            const { release_id } = (yield pool.query(insertReleaseQuery)).rows[0];
            yield client.query("COMMIT");
            release.setId(release_id);
            return release;
        }
        catch (err) {
            yield client.query("ROLLBACK");
            logger_conf_1.logger.error(`${__filename}: ROLLBACK. Can't create release.`);
            throw err;
        }
        finally {
            client.release();
        }
    });
}
exports.create = create;
function read(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const validatedId = yield validation_schemas_1.schemaId.validateAsync(id);
        const pool = yield postgres_1.connectDB();
        try {
            const getReleaseTextQuery = {
                text: "SELECT * FROM view_release WHERE id=$1",
                values: [validatedId],
            };
            const releaseMeta = (yield pool.query(getReleaseTextQuery)).rows[0];
            const release = releaseMeta ? new ReleaseExtended_1.ReleaseExtended(releaseMeta) : null;
            logger_conf_1.logger.debug(`filePath: ${__filename} \n${util_1.default.inspect(release)}`);
            return release;
        }
        catch (err) {
            logger_conf_1.logger.error(`${__filename}: Error while reading a release.`);
            throw err;
        }
    });
}
exports.read = read;
function readByReleaseId(releaseId) {
    return __awaiter(this, void 0, void 0, function* () {
        const validatedReleaseId = yield validation_schemas_1.schemaId.validateAsync(releaseId);
        const pool = yield postgres_1.connectDB();
        try {
            const getTracksTextQuery = {
                text: 'SELECT * FROM view_track_short WHERE "releaseId"=$1 ORDER BY "trackNo", "diskNo";',
                values: [validatedReleaseId],
            };
            const tracksMeta = (yield pool.query(getTracksTextQuery)).rows;
            const tracks = tracksMeta.length > 0 ? tracksMeta.map((row) => new Track_1.Track(row)) : [];
            logger_conf_1.logger.debug(`filePath: ${__filename} \n${util_1.default.inspect(tracks)}`);
            return { tracks };
        }
        catch (err) {
            logger_conf_1.logger.error(`${__filename}: Error while reading tracks by release id.`);
            throw err;
        }
    });
}
exports.readByReleaseId = readByReleaseId;
function readAll(params) {
    return __awaiter(this, void 0, void 0, function* () {
        let { sortBy, sortOrder, page, itemsPerPage, } = yield validation_schemas_1.schemaSortAndPaginate.validateAsync(params);
        logger_conf_1.logger.debug(`sortBy: ${sortBy} sortOrder: ${sortOrder}, page: ${page}, itemsPerPage: ${itemsPerPage}`);
        const pool = yield postgres_1.connectDB();
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
            const collection = (yield pool.query(readReleasesQuery))
                .rows[0];
            const releases = collection.releases
                ? collection.releases.map((row) => new Release_1.Release(row))
                : [];
            const { total_count } = collection;
            return { items: releases, totalCount: total_count };
        }
        catch (err) {
            logger_conf_1.logger.error(`${__filename}: Can't read releases names.`);
            throw err;
        }
    });
}
exports.readAll = readAll;
function update(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const validatedMetadata = yield validation_schemas_1.schemaUpdateRelease.validateAsync(metadata);
        const release = new ReleaseExtended_1.ReleaseExtended(validatedMetadata);
        const pool = yield postgres_1.connectDB();
        const client = yield pool.connect();
        try {
            yield client.query("BEGIN");
            const updateYearQuery = {
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
                values: [release.year],
            };
            const { tyear_id } = (yield pool.query(updateYearQuery)).rows[0];
            const updateLabelQuery = {
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
        SELECT label_id FROM ins \
        \
        UNION ALL \
        \
        SELECT l.label_id \
        FROM input_rows \
        JOIN label AS l \
        USING (name);",
                values: [release.label],
            };
            const { label_id } = (yield pool.query(updateLabelQuery)).rows[0];
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
                values: [release.artist],
            };
            const { artist_id } = (yield pool.query(insertArtistQuery)).rows[0];
            const updateReleaseQuery = {
                text: "UPDATE release \
         SET tyear_id = $1::integer, \
             label_id = $2::integer, \
             artist_id = $3::integer, \
             cat_no = $4, \
             cover_path = $5, \
             title = $6 \
         WHERE release_id = $7::integer;",
                values: [
                    tyear_id,
                    label_id,
                    artist_id,
                    release.catNo,
                    release.coverPath,
                    release.title,
                    release.getId(),
                ],
            };
            yield pool.query(updateReleaseQuery);
            //
            // Perform cleanup
            //
            // Delete artist record from artist table if it is not referenced by any
            // records in track_artist linking table or release table
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
            yield pool.query(deleteUnreferencedArtistsQuery);
            yield client.query("COMMIT");
            return release;
        }
        catch (err) {
            yield client.query("ROLLBACK");
            logger_conf_1.logger.error(`${__filename}: ROLLBACK. Error occured while updating release "${release.title}" in database.`);
            throw err;
        }
        finally {
            client.release();
        }
    });
}
exports.update = update;
function destroy(releaseId) {
    return __awaiter(this, void 0, void 0, function* () {
        const validatedReleaseId = yield validation_schemas_1.schemaId.validateAsync(releaseId);
        const pool = yield postgres_1.connectDB();
        const client = yield pool.connect();
        try {
            const deleteReleaseQuery = {
                // Delete RELEASE ( + corresponding records in track table and in linking tables track_genre and track_artist cascadingly)
                text: "DELETE FROM release \
         WHERE release_id = $1 \
         RETURNING release_id",
                values: [validatedReleaseId],
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
                // track_artist
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
            const deletedReleaseId = (yield client.query(deleteReleaseQuery))
                .rows[0];
            yield client.query(deleteYearQuery);
            yield client.query(deleteLabelQuery);
            yield client.query(deleteExtensionQuery);
            yield client.query(deleteGenreQuery);
            yield client.query(deleteArtistQuery);
            yield client.query("COMMIT");
            return deletedReleaseId;
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