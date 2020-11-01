import * as types from "../../types";

export class Track {
  private _filePath: types.FilePath;
  private _extension: types.Extension;
  private _artist: types.Artist;
  private _duration: types.Duration;
  private _bitrate: types.Bitrate;
  private _year: types.Year;
  private _trackNo: types.TrackNo;
  private _title: types.Title;
  private _album: types.Album;
  private _diskNo: types.DiskNo;
  private _label: types.Label;
  private _genre: types.Genre;

  constructor(metadata: types.TrackMetadata) {
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

  get filePath(): types.FilePath {
    return this._filePath;
  }

  get extension(): types.Extension {
    return this._extension;
  }

  get artist(): types.Artist {
    return this._artist;
  }

  get duration(): types.Duration {
    return this._duration;
  }

  get bitrate(): types.Bitrate {
    return this._bitrate;
  }

  get year(): types.Year {
    return this._year;
  }

  get trackNo(): types.TrackNo {
    return this._trackNo;
  }

  get title(): types.Title {
    return this._title;
  }

  get album(): types.Album {
    return this._album;
  }

  get diskNo(): types.DiskNo {
    return this._diskNo;
  }

  get label(): types.Label {
    return this._label;
  }

  get genre(): types.Genre {
    return this._genre;
  }

  get JSON(): string {
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

  static fromJSON(json: string): Track {
    const data = JSON.parse(json);
    const track = new Track(data);
    return track;
  }
}
