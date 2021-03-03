"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
class Track {
    constructor(metadata) {
        if (metadata.trackId)
            this._trackId = metadata.trackId;
        if (metadata.releaseId)
            this._releaseId = metadata.releaseId;
        this._filePath = metadata.filePath || null;
        this._extension = metadata.extension || "Unknown";
        this._artist = metadata.artist || ["Unknown"];
        this._duration = metadata.duration || 0;
        this._bitrate = metadata.bitrate || null;
        this._trackNo = metadata.trackNo || null;
        this._title = metadata.title || "Unknown";
        this._diskNo = metadata.diskNo || null;
        this._genre = metadata.genre || ["Unknown"];
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
    get artist() {
        return this._artist;
    }
    get duration() {
        return this._duration;
    }
    get bitrate() {
        return this._bitrate;
    }
    get trackNo() {
        return this._trackNo;
    }
    get title() {
        return this._title;
    }
    get diskNo() {
        return this._diskNo;
    }
    get genre() {
        return this._genre;
    }
    get JSON() {
        const track = {
            filePath: this.filePath,
            extension: this.extension,
            artist: this.artist,
            duration: this.duration,
            bitrate: this.bitrate,
            trackNo: this.trackNo,
            title: this.title,
            diskNo: this.diskNo,
            genre: this.genre,
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
exports.Track = Track;
//# sourceMappingURL=Track.js.map