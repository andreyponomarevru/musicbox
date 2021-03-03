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
exports.destroy = exports.exists = exports.create = void 0;
const logger_conf_1 = require("../../../config/logger-conf");
const postgres_1 = require("../../postgres");
function create(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const createUserQuery = {
                text: 'INSERT INTO appuser (name) \
         VALUES ($1) \
         RETURNING appuser_id AS "userId", name;',
                values: [username],
            };
            const newUser = (yield pool.query(createUserQuery)).rows[0];
            return { userId: newUser.userId, name: newUser.name };
        }
        catch (err) {
            const errStack = process.env.NODE_ENV === "development" ? err.stack : "";
            const msg = `An error occurred while adding a user to the database.\n${errStack}`;
            logger_conf_1.logger.error(msg);
            throw new Error();
        }
    });
}
exports.create = create;
function exists(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const userExistsQuery = {
                text: "SELECT EXISTS (SELECT 1 FROM appuser WHERE appuser_id = $1);",
                values: [id],
            };
            const exists = (yield pool.query(userExistsQuery)).rows[0];
            return exists;
        }
        catch (err) {
            const errStack = process.env.NODE_ENV === "development" ? err.stack : "";
            const msg = `An error occurred while checking the existence of a user in the database.\n${errStack}`;
            logger_conf_1.logger.error(msg);
            throw new Error();
        }
    });
}
exports.exists = exists;
function destroy(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const deleteTrackQuery = {
                text: "DELETE FROM appuser WHERE appuser_id = $1 RETURNING name",
                values: [id],
            };
            const { name } = (yield pool.query(deleteTrackQuery)).rows[0];
            return { name };
        }
        catch (err) {
            const text = `filePath: ${__filename}: An error occurred while deleting a user from the database\n${err.stack}`;
            logger_conf_1.logger.error(text);
            throw err;
        }
    });
}
exports.destroy = destroy;
//# sourceMappingURL=queries.js.map