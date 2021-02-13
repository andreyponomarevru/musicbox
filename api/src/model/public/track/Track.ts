import * as types from "../../../types";

export class Track implements types.TrackMetadata {
  private _trackId?: types.TrackId;
  private _releaseId?: types.ReleaseId;
  private _filePath: types.FilePath;
  private _extension: types.Extension;
  private _artist: types.TrackArtist;
  private _duration: types.Duration;
  private _bitrate: types.Bitrate;
  private _trackNo: types.TrackNo;
  private _title: types.TrackTitle;
  private _diskNo: types.DiskNo;
  private _genre: types.Genre;

  constructor(metadata: types.TrackMetadata) {
    if (metadata.trackId) this._trackId = metadata.trackId;
    if (metadata.releaseId) this._releaseId = metadata.releaseId;
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

  setTrackId(newId: types.TrackId) {
    if (typeof newId === "number") {
      this._trackId = newId;
    } else {
      throw new Error("Can't set trackId: argument must be a number");
    }
  }

  getTrackId(): types.TrackId | void {
    if (this._trackId) return this._trackId;
  }

  setReleaseId(newId: types.ReleaseId) {
    if (typeof newId === "number") {
      this._releaseId = newId;
    } else {
      throw new Error("Can't set trackId: argument must be a number");
    }
  }

  getReleaseId(): types.ReleaseId | void {
    if (this._releaseId) return this._releaseId;
  }

  get filePath(): types.FilePath {
    return this._filePath;
  }

  get extension(): types.Extension {
    return this._extension;
  }

  get artist(): types.TrackArtist {
    return this._artist;
  }

  get duration(): types.Duration {
    return this._duration;
  }

  get bitrate(): types.Bitrate {
    return this._bitrate;
  }

  get trackNo(): types.TrackNo {
    return this._trackNo;
  }

  get title(): types.TrackTitle {
    return this._title;
  }

  get diskNo(): types.DiskNo {
    return this._diskNo;
  }

  get genre(): types.Genre {
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
    if (trackId) Object.assign(track, { trackId });
    if (releaseId) Object.assign(track, { releaseId });

    return track;
  }
}
