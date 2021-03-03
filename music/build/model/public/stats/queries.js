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
exports.readLabelStats = exports.readArtistStats = exports.readYearStats = exports.readGenreStats = exports.readLibStats = void 0;
const logger_conf_1 = require("../../../config/logger-conf");
const postgres_1 = require("../../postgres");
function readLibStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const readLibStatsTextQuery = { text: "SELECT * FROM view_stats;" };
            const { rows } = yield pool.query(readLibStatsTextQuery);
            return rows[0];
        }
        catch (err) {
            logger_conf_1.logger.error(`Can't read library stats: ${err.stack}`);
            throw err;
        }
    });
}
exports.readLibStats = readLibStats;
function readGenreStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const readGenreStats = { text: "SELECT * FROM view_genre_stats;" };
            const { rows } = yield pool.query(readGenreStats);
            return rows;
        }
        catch (err) {
            logger_conf_1.logger.error(`Can't read genre stats: ${err.stack}`);
            throw err;
        }
    });
}
exports.readGenreStats = readGenreStats;
function readYearStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const readYearStats = { text: "SELECT * FROM view_year_stats;" };
            const { rows } = yield pool.query(readYearStats);
            return rows;
        }
        catch (err) {
            logger_conf_1.logger.error(`Can't read year stats: ${err.stack}`);
            throw err;
        }
    });
}
exports.readYearStats = readYearStats;
function readArtistStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const readArtistStats = { text: "SELECT * FROM view_artist_stats;" };
            const { rows } = yield pool.query(readArtistStats);
            return rows;
        }
        catch (err) {
            logger_conf_1.logger.error(`Can't read artist stats: ${err.stack}`);
            throw err;
        }
    });
}
exports.readArtistStats = readArtistStats;
function readLabelStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const readLabelStats = { text: "SELECT * FROM view_label_stats;" };
            const { rows } = yield pool.query(readLabelStats);
            return rows;
        }
        catch (err) {
            logger_conf_1.logger.error(`Can't read label stats: ${err.stack}`);
            throw err;
        }
    });
}
exports.readLabelStats = readLabelStats;
//# sourceMappingURL=queries.js.map