import * as types from "../../types";

const DEFAULT_COVER_URL = process.env.DEFAULT_COVER_URL!;

export class Release {
  private _id?: types.ReleaseId;
  private _artist: types.ReleaseArtist;
  private _year: types.Year;
  private _title: types.ReleaseTitle;
  private _label: types.Label;
  private _catNo: types.CatNo;
  private _coverPath: types.CoverPath;

  constructor(metadata: types.ReleaseMetadata) {
    if (metadata.id) this._id = metadata.id;
    this._year = metadata.year || 0;
    this._artist = metadata.artist || "Unknown";
    this._title = metadata.title || "Unknown";
    this._label = metadata.label || "Unknown";
    this._catNo = metadata.catNo || null;
    this._coverPath = metadata.coverPath || DEFAULT_COVER_URL;
  }

  setId(newId: types.ReleaseId) {
    if (typeof newId === "number") {
      this._id = newId;
    } else {
      throw new Error("Can't set releaseId: argument must be a number");
    }
  }

  getId(): types.ReleaseId | void {
    if (this._id) return this._id;
  }

  get artist(): types.ReleaseArtist {
    return this._artist;
  }

  get year(): types.Year {
    return this._year;
  }

  get title(): types.ReleaseTitle {
    return this._title;
  }

  get label(): types.Label {
    return this._label;
  }

  get coverPath(): types.CoverPath {
    return this._coverPath;
  }

  get catNo(): types.CatNo {
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
    if (id) Object.assign(release, { id });

    return release;
  }
  /*
  static fromJSON(json: string): Release {
    const data = JSON.parse(json);
    const Release = new Release(data);
    return Release;
  }
  */
}
