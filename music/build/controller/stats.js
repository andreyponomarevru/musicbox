"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const util_1 = __importDefault(require("util"));
const logger_conf_1 = require("../config/logger-conf");
const stats = __importStar(require("../model/public/stats/queries"));
const router = express_1.default.Router();
exports.router = router;
function getShortStats(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const retrievedStats = yield stats.readLibStats();
            logger_conf_1.logger.debug(`${__filename}: ${util_1.default.inspect(retrievedStats)}`);
            res.json({ results: retrievedStats });
        }
        catch (err) {
            next(err);
        }
    });
}
function getGenreStats(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const genreStats = yield stats.readGenreStats();
            logger_conf_1.logger.debug(`${__filename}: ${util_1.default.inspect(genreStats)}`);
            res.json({ results: genreStats });
        }
        catch (err) {
            next(err);
        }
    });
}
function getYearStats(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const yearStats = yield stats.readYearStats();
            logger_conf_1.logger.debug(`${__filename}: ${util_1.default.inspect(yearStats)}`);
            res.json({ results: yearStats });
        }
        catch (err) {
            next(err);
        }
    });
}
function getArtistStats(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const artistStats = yield stats.readArtistStats();
            logger_conf_1.logger.debug(`${__filename}: ${util_1.default.inspect(artistStats)}`);
            res.json({ results: artistStats });
        }
        catch (err) {
            next(err);
        }
    });
}
function getLabelStats(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const labelStats = yield stats.readLabelStats();
            logger_conf_1.logger.debug(`${__filename}: ${util_1.default.inspect(labelStats)}`);
            res.json({ results: labelStats });
        }
        catch (err) {
            next(err);
        }
    });
}
router.get("/", getShortStats);
router.get("/labels", getLabelStats);
router.get("/artists", getArtistStats);
router.get("/years", getYearStats);
router.get("/genres", getGenreStats);
//# sourceMappingURL=stats.js.map