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
exports.TrackMetadataParser = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const mm = __importStar(require("music-metadata"));
const jimp_1 = __importDefault(require("jimp"));
const uuid_1 = require("uuid");
const helpers_1 = require("./utility/helpers");
const constants_1 = require("./utility/constants");
class TrackMetadataParser {
    constructor(filePath) {
        this._filePath = filePath;
    }
    parseAudioFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const trackMetadata = yield mm.parseFile(this._filePath);
            const coverPath = yield this._parseCover(this._filePath, trackMetadata.common.picture);
            const extension = this._parseExtension(this._filePath);
            const duration = this._parseDuration(trackMetadata.format.duration);
            const bitrate = this._parseBitrate(trackMetadata.format.bitrate);
            const trackArtist = this._parseTrackArtist(trackMetadata.common.artist);
            const releaseArtist = this._parseReleaseArtist(trackMetadata.common.artist, trackMetadata.common.album);
            const year = this._parseYear(trackMetadata.common.year);
            const trackNo = this._parseTrackNo(trackMetadata.common.track.no);
            const trackTitle = this._parseTrackTitle(trackMetadata.common.title);
            const releaseTitle = this._parseReleaseTitle(trackMetadata.common.album);
            const diskNo = this._parseDiskNo(trackMetadata.common.disk.no);
            const label = this._parseLabel(trackMetadata.common.copyright);
            const genre = this._parseGenre(trackMetadata.common.genre);
            const catNo = this._parseCommentToCatNo(trackMetadata.common.comment);
            const extendedMetadata = {
                filePath: this._filePath,
                coverPath,
                extension,
                duration,
                bitrate,
                releaseArtist,
                trackArtist,
                year,
                trackNo,
                trackTitle,
                releaseTitle,
                diskNo,
                label,
                genre,
                catNo,
            };
            return extendedMetadata;
        });
    }
    _parseDuration(duration) {
        return duration || 0;
    }
    _parseBitrate(bitrate) {
        return bitrate || 0;
    }
    _parseYear(year) {
        return year || 0;
    }
    _parseLabel(name) {
        return name || "Unknown";
    }
    _parseTrackTitle(title) {
        return title || "";
    }
    _parseDiskNo(diskNo) {
        return diskNo || null;
    }
    _parseTrackNo(no) {
        return no || null;
    }
    _parseReleaseTitle(releaseTitle) {
        if (releaseTitle) {
            if (/Various - /.test(releaseTitle)) {
                return releaseTitle.split("Various - ")[1];
            }
            else
                return releaseTitle;
        }
        else
            return "";
    }
    _parseTrackArtist(name) {
        if (name === undefined)
            return ["Unknown"];
        else
            return [...name.split("; ")];
    }
    _parseReleaseArtist(artistName, releaseTitle) {
        if (releaseTitle) {
            if (/Various - /.test(releaseTitle)) {
                return "Various";
            }
            else if (artistName) {
                return artistName.split("; ")[0];
            }
            else
                return "Unknown";
        }
        return "Unknown";
    }
    _parseGenre(genre) {
        if (Array.isArray(genre))
            return [...genre[0].split("; ")];
        else
            return ["Unknown"];
    }
    _parseExtension(filePath) {
        return path_1.default.extname(filePath).slice(1);
    }
    _parseCover(filePath, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const coverName = path_1.default.parse(filePath).name;
            const coverMetadata = image ? Object.assign({ name: coverName }, image[0]) : null;
            if (coverMetadata) {
                const extension = coverMetadata.format.split("/")[1];
                const fullname = `${uuid_1.v4()}.${extension}`;
                const buffer = coverMetadata.data;
                const apiCoverPath = helpers_1.buildApiCoverPath(fullname);
                const localCoverPath = helpers_1.buildLocalCoverPath(fullname);
                yield fs_extra_1.default.writeFile(localCoverPath, buffer);
                yield this._optimizeImage(localCoverPath);
                return apiCoverPath;
            }
            else {
                return constants_1.DEFAULT_COVER_URL;
            }
        });
    }
    _optimizeImage(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield jimp_1.default.read(path);
            image.resize(450, 450).quality(60).write(path);
        });
    }
    _parseCommentToCatNo(comment) {
        if (Array.isArray(comment)) {
            const regex = /[\w\s{0,1}-]+/;
            const catNo = regex.exec(comment[0]);
            return catNo ? catNo[0] : null;
        }
        else
            return null;
    }
}
exports.TrackMetadataParser = TrackMetadataParser;
//# sourceMappingURL=TrackMetadataParser.js.map