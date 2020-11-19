"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _filePath, _extension, _artist, _duration, _bitrate, _year, _trackNo, _title, _album, _diskNo, _label, _genre;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
class Track {
    constructor(metadata) {
        _filePath.set(this, void 0);
        _extension.set(this, void 0);
        _artist.set(this, void 0);
        _duration.set(this, void 0);
        _bitrate.set(this, void 0);
        _year.set(this, void 0);
        _trackNo.set(this, void 0);
        _title.set(this, void 0);
        _album.set(this, void 0);
        _diskNo.set(this, void 0);
        _label.set(this, void 0);
        _genre.set(this, void 0);
        __classPrivateFieldSet(this, _filePath, metadata.filePath);
        __classPrivateFieldSet(this, _extension, metadata.extension);
        __classPrivateFieldSet(this, _artist, metadata.artist);
        __classPrivateFieldSet(this, _duration, metadata.duration);
        __classPrivateFieldSet(this, _bitrate, metadata.bitrate);
        __classPrivateFieldSet(this, _year, metadata.year);
        __classPrivateFieldSet(this, _trackNo, metadata.trackNo);
        __classPrivateFieldSet(this, _title, metadata.title);
        __classPrivateFieldSet(this, _album, metadata.album);
        __classPrivateFieldSet(this, _diskNo, metadata.diskNo);
        __classPrivateFieldSet(this, _label, metadata.label);
        __classPrivateFieldSet(this, _genre, metadata.genre);
    }
    get filePath() {
        return __classPrivateFieldGet(this, _filePath);
    }
    get extension() {
        return __classPrivateFieldGet(this, _extension);
    }
    get artist() {
        return __classPrivateFieldGet(this, _artist);
    }
    get duration() {
        return __classPrivateFieldGet(this, _duration);
    }
    get bitrate() {
        return __classPrivateFieldGet(this, _bitrate);
    }
    get year() {
        return __classPrivateFieldGet(this, _year);
    }
    get trackNo() {
        return __classPrivateFieldGet(this, _trackNo);
    }
    get title() {
        return __classPrivateFieldGet(this, _title);
    }
    get album() {
        return __classPrivateFieldGet(this, _album);
    }
    get diskNo() {
        return __classPrivateFieldGet(this, _diskNo);
    }
    get label() {
        return __classPrivateFieldGet(this, _label);
    }
    get genre() {
        return __classPrivateFieldGet(this, _genre);
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
_filePath = new WeakMap(), _extension = new WeakMap(), _artist = new WeakMap(), _duration = new WeakMap(), _bitrate = new WeakMap(), _year = new WeakMap(), _trackNo = new WeakMap(), _title = new WeakMap(), _album = new WeakMap(), _diskNo = new WeakMap(), _label = new WeakMap(), _genre = new WeakMap();
//# sourceMappingURL=Track.js.map