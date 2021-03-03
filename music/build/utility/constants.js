"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SORT_ORDER = exports.PER_PAGE_NUMS = exports.SORT_BY = exports.DEFAULT_USER_NAME = exports.DEFAULT_COVER_URL = exports.IMG_DIR_URL = exports.IMG_LOCAL_DIR = exports.MUSIC_LIB_DIR = exports.API_SERVER_PORT = exports.SUPPORTED_CODEC = void 0;
exports.SUPPORTED_CODEC = process.env.SUPPORTED_CODEC
    .split(",")
    .map((name) => name.toLowerCase());
exports.API_SERVER_PORT = Number(process.env.API_SERVER_PORT);
exports.MUSIC_LIB_DIR = process.env.MUSIC_LIB_DIR;
exports.IMG_LOCAL_DIR = process.env.IMG_LOCAL_DIR;
exports.IMG_DIR_URL = process.env.IMG_DIR_URL;
exports.DEFAULT_COVER_URL = process.env.DEFAULT_COVER_PATH;
exports.DEFAULT_USER_NAME = process.env.DEFAULT_USER_NAME;
exports.SORT_BY = [
    "year",
    "artist",
    "title",
    "trackArtist",
    "trackTitle",
    "releaseArtist",
    "releaseTitle",
];
exports.PER_PAGE_NUMS = [25, 50, 100, 250, 500];
exports.SORT_ORDER = ["desc", "asc"];
//# sourceMappingURL=constants.js.map