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
exports.close = exports.connectDB = void 0;
const loggerConf_1 = require("../config/loggerConf");
const pg_1 = require("pg");
const { POSTGRES_USER: user, POSTGRES_PASSWORD: password, POSTGRES_HOST: host, POSTGRES_DATABASE: database, } = process.env;
const port = Number(process.env.POSTGRES_PORT);
let pool;
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (pool) {
            return pool;
        }
        else {
            pool = new pg_1.Pool({ user, host, database, password, port });
            return pool;
        }
    });
}
exports.connectDB = connectDB;
// Shutdown cleanly. Doc: https://node-postgres.com/api/pool#poolend
function close() {
    return __awaiter(this, void 0, void 0, function* () {
        if (pool)
            yield pool.end();
        pool = undefined;
        loggerConf_1.logger.info("Pool has ended");
    });
}
exports.close = close;
//# sourceMappingURL=postgres.js.map