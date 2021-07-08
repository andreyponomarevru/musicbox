import { DEFAULT_COVER_URL } from "../../../config/constants";
import {
  TrackId,
  ReleaseId,
  FilePath,
  Extension,
  ReleaseArtist,
  ReleaseTitle,
  TrackArtist,
  Duration,
  DiskNo,
  Bitrate,
  TrackTitle,
  TrackNo,
  Year,
  Label,
  Genre,
  CatNo,
  CoverPath,
} from "../../../types";

export interface TrackExtendedDBResponse {
  readonly track_id: TrackId;
  readonly release_id: ReleaseId;
  readonly file_path: FilePath;
  readonly extension: Extension;
  readonly release_artist: ReleaseArtist;
  readonly track_artist: TrackArtist;
  readonly duration: Duration;
  readonly bitrate: Bitrate;
  readonly year: Year;
  readonly track_no: TrackNo;
  readonly release_title: ReleaseTitle;
  readonly track_title: TrackTitle;
  readonly disk_no: DiskNo;
  readonly genre: Genre;
  readonly label: Label;
  readonly cover_path: CoverPath;
  readonly cat_no: CatNo;
}

export interface TrackExtendedMeta {
  trackId?: TrackId;
  releaseId?: ReleaseId;
  readonly filePath: FilePath;
  readonly extension: Extension;
  readonly releaseArtist: ReleaseArtist;
  readonly trackArtist: TrackArtist;
  readonly duration: Duration;
  readonly bitrate: Bitrate;
  readonly year: Year;
  readonly trackNo: TrackNo;
  readonly releaseTitle: ReleaseTitle;
  readonly trackTitle: TrackTitle;
  readonly diskNo: DiskNo;
  readonly genre: Genre;
  readonly label: Label;
  readonly coverPath: CoverPath;
  readonly catNo: CatNo;
}

export class TrackExtended {
  private _trackId?: TrackId;
  private _releaseId?: ReleaseId;
  private readonly _filePath: FilePath;
  private readonly _extension: Extension;
  private readonly _trackArtist: TrackArtist;
  private readonly _releaseArtist: ReleaseArtist;
  private readonly _duration: Duration;
  private readonly _bitrate: Bitrate;
  private readonly _year: Year;
  private readonly _trackNo: TrackNo;
  private readonly _trackTitle: TrackTitle;
  private readonly _releaseTitle: ReleaseTitle;
  private readonly _diskNo: DiskNo;
  private readonly _label: Label;
  private readonly _genre: Genre;
  private readonly _coverPath: CoverPath;
  private readonly _catNo: CatNo;

  constructor(metadata: TrackExtendedDBResponse) {
    this._trackId = metadata.track_id;
    this._releaseId = metadata.release_id;
    this._filePath = metadata.file_path;
    this._extension = metadata.extension;
    this._trackArtist = metadata.track_artist;
    this._releaseArtist = metadata.release_artist;
    this._duration = metadata.duration;
    this._bitrate = metadata.bitrate;
    this._year = metadata.year;
    this._trackNo = metadata.track_no;
    this._trackTitle = metadata.track_title;
    this._releaseTitle = metadata.release_title;
    this._diskNo = metadata.disk_no;
    this._label = metadata.label;
    this._genre = metadata.genre;
    this._coverPath = metadata.cover_path || DEFAULT_COVER_URL;
    this._catNo = metadata.cat_no;
  }

  setTrackId(newId: TrackId): void | never {
    if (typeof newId === "number") this._trackId = newId;
    else throw new Error("Can't set trackId: argument must be a number");
  }

  getTrackId(): TrackId | never {
    if (this._trackId) return this._trackId;
    else throw new Error("trackId is not set");
  }

  setReleaseId(newId: ReleaseId): void | never {
    if (typeof newId === "number") this._releaseId = newId;
    else throw new Error("Can't set releaseId: argument must be a number");
  }

  getReleaseId(): ReleaseId | never {
    if (this._releaseId) return this._releaseId;
    else throw new Error("releaseId is not set");
  }

  get filePath(): FilePath {
    return this._filePath;
  }

  get extension(): Extension {
    return this._extension;
  }

  get trackArtist(): TrackArtist {
    return this._trackArtist;
  }

  get releaseArtist(): ReleaseArtist {
    return this._releaseArtist;
  }

  get duration(): Duration {
    return this._duration;
  }

  get bitrate(): Bitrate {
    return this._bitrate;
  }

  get year(): Year {
    return this._year;
  }

  get trackNo(): TrackNo {
    return this._trackNo;
  }

  get trackTitle(): TrackTitle {
    return this._trackTitle;
  }

  get releaseTitle(): ReleaseTitle {
    return this._releaseTitle;
  }

  get diskNo(): DiskNo {
    return this._diskNo;
  }

  get label(): Label {
    return this._label;
  }

  get genre(): Genre {
    return this._genre;
  }

  get coverPath(): CoverPath {
    return this._coverPath;
  }

  get catNo(): CatNo {
    return this._catNo;
  }

  get JSON(): TrackExtendedMeta {
    const track: TrackExtendedMeta = {
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

  static fromJSON(json: string): TrackExtendedMeta {
    const parsedJSON = JSON.parse(json);
    const track = new TrackExtended(parsedJSON);
    return track;
  }
}
