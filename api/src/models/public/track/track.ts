import {
  TrackId,
  ReleaseId,
  FilePath,
  Extension,
  TrackArtist,
  Duration,
  DiskNo,
  Bitrate,
  TrackTitle,
  TrackNo,
  Genre,
} from "../../../types";
import { TrackMetaDBResponse, TrackMeta } from "./types";

export class Track {
  private readonly _trackId: TrackId;
  private readonly _releaseId: ReleaseId;
  private readonly _filePath: FilePath;
  private readonly _extension: Extension;
  private readonly _artist: TrackArtist;
  private readonly _duration: Duration;
  private readonly _bitrate: Bitrate;
  private readonly _trackNo: TrackNo;
  private readonly _title: TrackTitle;
  private readonly _diskNo: DiskNo;
  private readonly _genre: Genre;

  constructor(metadata: TrackMetaDBResponse) {
    this._trackId = metadata.track_id;
    this._releaseId = metadata.release_id;
    this._filePath = metadata.file_path;
    this._extension = metadata.extension;
    this._artist = metadata.artist;
    this._duration = metadata.duration;
    this._bitrate = metadata.bitrate;
    this._trackNo = metadata.track_no;
    this._title = metadata.title;
    this._diskNo = metadata.disk_no;
    this._genre = metadata.genre;
  }

  get trackId(): TrackId | never {
    if (this._trackId) return this._trackId;
    else throw new Error("trackId is not set");
  }

  get releaseId(): ReleaseId | never {
    if (this._releaseId) return this._releaseId;
    else throw new Error("releaseId is not set");
  }

  get filePath(): FilePath {
    return this._filePath;
  }

  get extension(): Extension {
    return this._extension;
  }

  get artist(): TrackArtist {
    return this._artist;
  }

  get duration(): Duration {
    return this._duration;
  }

  get bitrate(): Bitrate {
    return this._bitrate;
  }

  get trackNo(): TrackNo {
    return this._trackNo;
  }

  get title(): TrackTitle {
    return this._title;
  }

  get diskNo(): DiskNo {
    return this._diskNo;
  }

  get genre(): Genre {
    return this._genre;
  }

  get JSON(): TrackMeta {
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
      trackId: this.trackId,
      releaseId: this.releaseId,
    };

    return track;
  }

  static fromJSON(json: string): TrackMeta {
    const parsedJSON = JSON.parse(json);
    const track = new Track(parsedJSON);
    return track;
  }
}
