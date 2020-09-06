const logger = require("../../utility/loggerConf.js");
const Validator = require("./../../utility/Validator");

class Track {
  constructor(metadata) {
    this._file_path = metadata.filePath;
    this._extension = metadata.format.codec;
    this._artist = metadata.common.artist;
    this._duration = metadata.format.duration;
    this._bitrate = metadata.format.bitrate;
    this._year = metadata.common.year;
    this._track_no = metadata.common.track.no;
    this._title = metadata.common.title;
    this._album = metadata.common.album;
    this._disk_no = metadata.common.disk.no;
    this._label = metadata.common.copyright;
    this._genre = metadata.common.genre;
    this._bpm = 0;
  }

  get file_path() {
    return this._path;
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
  get track_no() {
    return this._trackNo;
  }
  get title() {
    return this._title;
  }
  get album() {
    return this._album;
  }
  get disk_no() {
    return this._diskNo;
  }
  get label() {
    return this._label;
  }
  get genre() {
    return this._genre;
  }
  get bpm() {
    return this._bpm;
  }

  get JSON() {
    return JSON.stringify({
      file_path: this._filePath,
      extension: this._extension,
      artist: this._artist,
      duration: this._duration,
      bitrate: this._bitrate,
      year: this._year,
      track_no: this._trackNo,
      title: this._title,
      album: this._album,
      disk_no: this.diskNo,
      label: this._label,
      genre: this._genre,
      bpm: this._bpm,
    });
  }

  static fromJSON(json) {
    const data = JSON.parse(json);
    const track = new Track(data);
    return track;
  }
}

module.exports = Track;
