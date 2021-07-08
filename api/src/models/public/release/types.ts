import {
  ReleaseId,
  ReleaseArtist,
  Year,
  ReleaseTitle,
  CoverPath,
  Label,
  CatNo,
} from "./../../../types";

export interface ReleaseMetaDBResponse {
  readonly id: ReleaseId;
  readonly artist: ReleaseArtist;
  readonly year: Year;
  readonly title: ReleaseTitle;
  readonly label: Label;
  readonly cat_no: CatNo;
  readonly cover_path: CoverPath;
}

export interface ReleaseMeta {
  id: ReleaseId;
  artist: ReleaseArtist;
  year: Year;
  title: ReleaseTitle;
  label: Label;
  catNo: CatNo;
  coverPath: CoverPath;
}

export type CatNoDBResponse = { cat_no: string };
