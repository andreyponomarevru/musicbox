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
exports.readAll = void 0;
const loggerConf_1 = require("../../config/loggerConf");
const postgres_1 = require("../postgres");
function readAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = yield postgres_1.connectDB();
        try {
            const readAlbumsText = "SELECT DISTINCT ON (album) album, track_id FROM track ORDER BY album";
            const albums = (yield pool.query(readAlbumsText)).rows;
            return { albums };
        }
        catch (err) {
            loggerConf_1.logger.error(`Can't read album names: ${err.stack}`);
            throw err;
        }
    });
}
exports.readAll = readAll;
//# sourceMappingURL=queries.js.map