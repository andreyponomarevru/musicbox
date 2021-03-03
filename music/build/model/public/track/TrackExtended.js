"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackExtended = void 0;
const constants_1 = require("../../../utility/constants");
class TrackExtended {
    constructor(metadata) {
        if (metadata.trackId)
            this._trackId = metadata.trackId;
        if (metadata.releaseId)
            this._releaseId = metadata.releaseId;
        this._filePath = metadata.filePath || null;
        this._extension = metadata.extension || "Unknown";
        this._trackArtist = metadata.trackArtist || ["Unknown"];
        this._releaseArtist = metadata.releaseArtist || "Unknown";
        this._duration = metadata.duration || 0;
        this._bitrate = metadata.bitrate || null;
        this._year = metadata.year || 0;
        this._trackNo = metadata.trackNo || null;
        this._trackTitle = metadata.trackTitle || "Unknown";
        this._releaseTitle = metadata.releaseTitle || "Unknown";
        this._diskNo = metadata.diskNo || null;
        this._label = metadata.label || "Unknown";
        this._genre = metadata.genre || ["Unknown"];
        this._coverPath = metadata.coverPath || constants_1.DEFAULT_COVER_URL;
        this._catNo = metadata.catNo || null;
    }
    setTrackId(newId) {
        if (typeof newId === "number") {
            this._trackId = newId;
        }
        else {
            throw new Error("Can't set trackId: argument must be a number");
        }
    }
    getTrackId() {
        if (this._trackId)
            return this._trackId;
    }
    setReleaseId(newId) {
        if (typeof newId === "number") {
            this._releaseId = newId;
        }
        else {
            throw new Error("Can't set trackId: argument must be a number");
        }
    }
    getReleaseId() {
        if (this._releaseId)
            return this._releaseId;
    }
    get filePath() {
        return this._filePath;
    }
    get extension() {
        return this._extension;
    }
    get trackArtist() {
        return this._trackArtist;
    }
    get releaseArtist() {
        return this._releaseArtist;
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
    get trackTitle() {
        return this._trackTitle;
    }
    get releaseTitle() {
        return this._releaseTitle;
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
    get coverPath() {
        return this._coverPath;
    }
    get catNo() {
        return this._catNo;
    }
    get JSON() {
        const track = {
            filePath: this.filePath,
            extension: this.extension,
            trackArtist: this.trackArtist,
            releaseArtist: this.releaseArtist,
            duration: this.duration,
            bitrate: this.bitrate,
            year: this.year,
            trackNo: this.trackNo,
            trackTitle: this.trackTitle,
            releaseTitle: this.releaseTitle,
            diskNo: this.diskNo,
            label: this.label,
            genre: this.genre,
            coverPath: this.coverPath,
            catNo: this.catNo,
        };
        const trackId = this.getTrackId();
        const releaseId = this.getReleaseId();
        if (trackId)
            Object.assign(track, { trackId });
        if (releaseId)
            Object.assign(track, { releaseId });
        return track;
    }
}
exports.TrackExtended = TrackExtended;
//# sourceMappingURL=TrackExtended.js.map