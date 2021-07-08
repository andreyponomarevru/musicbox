import {
  ReleaseId,
  ReleaseArtist,
  ReleaseTitle,
  Year,
  Label,
  CatNo,
  CoverPath,
} from "../../../types";

import { ReleaseMetaDBResponse, ReleaseMeta } from "./types";

const DEFAULT_COVER_URL = process.env.DEFAULT_COVER_URL as string;

export class Release {
  private _id: ReleaseId;
  private _artist: ReleaseArtist;
  private _year: Year;
  private _title: ReleaseTitle;
  private _label: Label;
  private _catNo: CatNo;
  private _coverPath: CoverPath;

  constructor(metadata: ReleaseMetaDBResponse) {
    this._id = metadata.id;
    this._year = metadata.year;
    this._artist = metadata.artist;
    this._title = metadata.title;
    this._label = metadata.label;
    this._catNo = metadata.cat_no;
    this._coverPath = metadata.cover_path || DEFAULT_COVER_URL;
  }

  setId(newId: ReleaseId): void {
    if (typeof newId === "number") {
      this._id = newId;
    } else {
      throw new Error("Can't set releaseId: argument must be a number");
    }
  }

  get id(): ReleaseId {
    return this._id;
  }

  get artist(): ReleaseArtist {
    return this._artist;
  }

  get year(): Year {
    return this._year;
  }

  get title(): ReleaseTitle {
    return this._title;
  }

  get label(): Label {
    return this._label;
  }

  get coverPath(): CoverPath {
    return this._coverPath;
  }

  get catNo(): CatNo {
    return this._catNo;
  }

  get JSON(): ReleaseMeta {
    const release = {
      id: this.id,
      year: this.year,
      artist: this.artist,
      title: this.title,
      coverPath: this.coverPath,
      label: this.label,
      catNo: this.catNo,
    };

    return release;
  }

  static fromJSON(json: string): ReleaseMeta {
    const parsedJSON = JSON.parse(json);
    const release = new Release(parsedJSON);
    return release;
  }
}
