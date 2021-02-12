import * as types from "../../types";

export class ReleaseShort {
  private _id: types.ReleaseId;
  private _artist: types.ReleaseArtist;
  private _title: types.ReleaseTitle;
  private _year: types.Year;
  private _coverPath: types.CoverPath;

  constructor(metadata: types.ReleaseShortMetadata) {
    this._id = metadata.id;
    this._year = metadata.year;
    this._artist = metadata.artist;
    this._title = metadata.title;
    this._coverPath = metadata.coverPath;
  }

  get id(): types.ReleaseId {
    return this._id;
  }

  get year(): types.Year {
    return this._year;
  }

  get artist(): types.ReleaseArtist {
    return this._artist;
  }

  get title(): types.ReleaseTitle {
    return this._title;
  }

  get coverPath(): types.CoverPath {
    return this._coverPath;
  }

  get JSON() {
    const release = {
      id: this.id,
      year: this.year,
      artist: this.artist,
      title: this.title,
      coverPath: this.coverPath,
    };

    return release;
  }
}
