export type TrackTitle = string;
export type ReleaseTitle = string;
export type Year = number;
export type ReleaseId = number;
export type Label = string;
export type CoverPath = string;
export type CatNo = string | null;
export type ReleaseArtist = string;
export type TrackArtist = string[];
export type Duration = number;
export type Genre = string[];
export type DiskNo = number | null;
export type TrackNo = number | null;
export type Bitrate = number | null;
export type Extension = string;
export type FilePath = string | null;
export type TrackId = number;

export interface TrackMetadata {
  trackId?: number;
  releaseId?: number;

  filePath: FilePath;
  extension: Extension;
  releaseArtist: ReleaseArtist;
  trackArtist: TrackArtist;
  duration: Duration;
  bitrate: Bitrate;
  year: Year;
  trackNo: TrackNo;
  releaseTitle: ReleaseTitle;
  trackTitle: TrackTitle;
  diskNo: DiskNo;
  genre: Genre;
  label: Label;
  coverPath: CoverPath;
  catNo: CatNo;
}

export interface ReleaseCollectionItemMetadata {
  id: number;
  year: Year;
  artist: ReleaseArtist;
  title: ReleaseTitle;
  coverPath: CoverPath;
}

export interface ReleaseMetadata {
  id?: ReleaseId;
  artist: ReleaseArtist;
  year: Year;
  title: ReleaseTitle;
  label: Label;
  catNo: CatNo;
  coverPath: CoverPath;
}

export interface TrackPicture {
  path: string;
  url: string;
  data: Buffer;
}

export type MinMax = {
  min: number;
  max: number;
};
export type Includes = (string | number)[];
export type Allow = [null | undefined];

export interface ValidationSchema {
  allow?: ((sourceValue: boolean) => boolean) | Allow;
  isLength?: ((sourceValue: string, target: MinMax) => boolean) | MinMax;
  isRange?: ((sourceValue: number, target: MinMax) => boolean) | MinMax;
  includes?:
    | ((sourceValue: string | number, target: Includes) => boolean)
    | Includes;
}

export type ReadAllByPages = {
  sortBy?: string;
  sortOrder?: string;
  pagination: {
    page?: number;
    itemsPerPage?: number;
  };
};
