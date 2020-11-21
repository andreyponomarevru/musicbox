import * as types from "../../types";

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
    this._year = metadata.year;
    this._artist = metadata.artist;
    this._title = metadata.title;
    this._label = metadata.label;
    this._catNo = metadata.catNo;
    this._coverPath = metadata.coverPath;
  }

  setAlbumId(newId: types.ReleaseId) {
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
