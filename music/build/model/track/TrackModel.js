"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatedTrackMetadata = exports.Track = void 0;
const interfaces_1 = require("./../../interfaces");
Object.defineProperty(exports, "ValidatedTrackMetadata", { enumerable: true, get: function () { return interfaces_1.ValidatedTrackMetadata; } });
class Track {
    constructor(metadata) {
        this._filePath = metadata.filePath;
        this._extension = metadata.extension;
        this._artist = metadata.artist;
        this._duration = metadata.duration;
        this._bitrate = metadata.bitrate;
        this._year = metadata.year;
        this._trackNo = metadata.trackNo;
        this._title = metadata.title;
        this._album = metadata.album;
        this._diskNo = metadata.diskNo;
        this._label = metadata.label;
        this._genre = metadata.genre;
    }
    get filePath() {
        return this._filePath;
    }
    get extension() {
        return this._extension;
    }
    get artist() {
        return this._artist;
    }
    get duration() {
        return this._duration;
    }
    get bitrate() {
        return this._bitrate;
    }
    get year() {
        return this._year;
    }
    get trackNo() {
        return this._trackNo;
    }
    get title() {
        return this._title;
    }
    get album() {
        return this._album;
    }
    get diskNo() {
        return this._diskNo;
    }
    get label() {
        return this._label;
    }
    get genre() {
        return this._genre;
    }
    get JSON() {
        return JSON.stringify({
            filePath: this.filePath,
            extension: this.extension,
            artist: this.artist,
            duration: this.duration,
            bitrate: this.bitrate,
            year: this.year,
            trackNo: this.trackNo,
            title: this.title,
            album: this.album,
            diskNo: this.diskNo,
            label: this.label,
            genre: this.genre,
        });
    }
    static fromJSON(json) {
        const data = JSON.parse(json);
        const track = new Track(data);
        return track;
    }
}
exports.Track = Track;
//# sourceMappingURL=TrackModel.js.map