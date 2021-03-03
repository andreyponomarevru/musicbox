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
exports.update = exports.read = exports.create = void 0;
const logger_conf_1 = require("../../../config/logger-conf");
const postgres_1 = require("../../postgres");
function create(userId, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        console.log(userId, settings);
        try {
            const createUserSettingsQuery = {
                text: 'UPDATE appuser \
         SET settings = $1 \
         WHERE appuser_id = $2 \
         RETURNING appuser_id AS "userId", settings;',
                values: [JSON.stringify(settings), userId],
            };
            const createdSettings = (yield pool.query(createUserSettingsQuery)).rows[0];
            return {
                userId: createdSettings.userId,
                settings: createdSettings.settings,
            };
        }
        catch (err) {
            logger_conf_1.logger.error(`An error occured while creating settings in the database:\n${err.stack}`);
            throw err;
        }
    });
}
exports.create = create;
function read(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const readUserSettingsQuery = {
                text: 'SELECT appuser_id AS "userId", settings \
         FROM appuser \
         WHERE appuser_id = $1',
                values: [id],
            };
            const retrievedSettings = (yield pool.query(readUserSettingsQuery)).rows[0];
            return {
                userId: retrievedSettings.userId,
                settings: retrievedSettings.settings,
            };
        }
        catch (err) {
            logger_conf_1.logger.error(`An error occured while reading settings from database:\n${err.stack}`);
            throw err;
        }
    });
}
exports.read = read;
function update(id, newSettings) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const readUserSettingsQuery = {
                text: 'UPDATE appuser \
         SET settings = $1 \
         WHERE appuser_id = $2 \
         RETURNING appuser_id AS "userId", name;',
                values: [newSettings, id],
            };
            const updatedSettings = (yield pool.query(readUserSettingsQuery)).rows[0];
            return {
                userId: updatedSettings.userId,
                settings: updatedSettings.settings,
            };
        }
        catch (err) {
            logger_conf_1.logger.error(`An error occured while reading settings from database:\n${err.stack}`);
            throw err;
        }
    });
}
exports.update = update;
//# sourceMappingURL=queries.js.map