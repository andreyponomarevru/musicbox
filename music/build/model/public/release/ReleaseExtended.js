"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseExtended = void 0;
const DEFAULT_COVER_URL = process.env.DEFAULT_COVER_URL;
class ReleaseExtended {
    constructor(metadata) {
        if (metadata.id)
            this._id = metadata.id;
        this._year = metadata.year || 0;
        this._artist = metadata.artist || "Unknown";
        this._title = metadata.title || "Unknown";
        this._label = metadata.label || "Unknown";
        this._catNo = metadata.catNo || null;
        this._coverPath = metadata.coverPath || DEFAULT_COVER_URL;
    }
    setId(newId) {
        if (typeof newId === "number") {
            this._id = newId;
        }
        else {
            throw new Error("Can't set releaseId: argument must be a number");
        }
    }
    getId() {
        if (this._id)
            return this._id;
    }
    get artist() {
        return this._artist;
    }
    get year() {
        return this._year;
    }
    get title() {
        return this._title;
    }
    get label() {
        return this._label;
    }
    get coverPath() {
        return this._coverPath;
    }
    get catNo() {
        return this._catNo;
    }
    get JSON() {
        const release = {
            year: this.year,
            artist: this.artist,
            title: this.title,
            label: this.label,
            catNo: this.catNo,
            coverPath: this.coverPath,
        };
        const id = this.getId();
        if (id)
            Object.assign(release, { id });
        return release;
    }
}
exports.ReleaseExtended = ReleaseExtended;
//# sourceMappingURL=ReleaseExtended.js.map