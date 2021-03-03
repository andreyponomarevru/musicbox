"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Release = void 0;
class Release {
    constructor(metadata) {
        this._id = metadata.id;
        this._year = metadata.year;
        this._artist = metadata.artist;
        this._title = metadata.title;
        this._coverPath = metadata.coverPath;
    }
    get id() {
        return this._id;
    }
    get year() {
        return this._year;
    }
    get artist() {
        return this._artist;
    }
    get title() {
        return this._title;
    }
    get coverPath() {
        return this._coverPath;
    }
    get JSON() {
        const release = {
            id: this.id,
            year: this.year,
            artist: this.artist,
            title: this.title,
            coverPath: this.coverPath,
        };
        return release;
    }
}
exports.Release = Release;
//# sourceMappingURL=Release.js.map