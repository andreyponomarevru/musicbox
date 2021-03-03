import * as types from "../../../types";
import { DEFAULT_COVER_URL } from "../../../utility/constants";

export class TrackExtended implements types.TrackExtendedMeta {
  private _trackId?: types.TrackId;
  private _releaseId?: types.ReleaseId;
  private _filePath: types.FilePath;
  private _extension: types.Extension;
  private _trackArtist: types.TrackArtist;
  private _releaseArtist: types.ReleaseArtist;
  private _duration: types.Duration;
  private _bitrate: types.Bitrate;
  private _year: types.Year;
  private _trackNo: types.TrackNo;
  private _trackTitle: types.TrackTitle;
  private _releaseTitle: types.ReleaseTitle;
  private _diskNo: types.DiskNo;
  private _label: types.Label;
  private _genre: types.Genre;
  private _coverPath: types.CoverPath;
  private _catNo: types.CatNo;

  constructor(metadata: types.TrackExtendedMeta) {
    if (metadata.trackId) this._trackId = metadata.trackId;
    if (metadata.releaseId) this._releaseId = metadata.releaseId;
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
    this._coverPath = metadata.coverPath || DEFAULT_COVER_URL;
    this._catNo = metadata.catNo || null;
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

  get trackArtist(): types.TrackArtist {
    return this._trackArtist;
  }

  get releaseArtist(): types.ReleaseArtist {
    return this._releaseArtist;
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

  get trackTitle(): types.TrackTitle {
    return this._trackTitle;
  }

  get releaseTitle(): types.ReleaseTitle {
    return this._releaseTitle;
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

  get coverPath(): types.CoverPath {
    return this._coverPath;
  }

  get catNo(): types.CatNo {
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
    if (trackId) Object.assign(track, { trackId });
    if (releaseId) Object.assign(track, { releaseId });

    return track;
  }
}
