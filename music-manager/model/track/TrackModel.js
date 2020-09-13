const logger = require("../../utility/loggerConf.js");
const Validator = require("./../../utility/Validator");

class Track {
  constructor({
    filePath,
    extension,
    artist,
    duration,
    bitrate,
    year,
    trackNo,
    title,
    album,
    diskNo,
    label,
    genre,
  }) {
    this._filePath = filePath;
    this._extension = extension;
    this._artist = artist;
    this._duration = duration;
    this._bitrate = bitrate;
    this._year = year;
    this._trackNo = trackNo;
    this._title = title;
    this._album = album;
    this._diskNo = diskNo;
    this._label = label;
    this._genre = genre;
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
