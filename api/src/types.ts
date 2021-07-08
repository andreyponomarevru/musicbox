export interface Cover {
  readonly url: string;
  readonly destinationFilepath?: string;
  readonly data?: Buffer;
}

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
export type Bitrate = number;
export type Extension = string;
export type FilePath = string | null;
export type TrackId = number;

export interface ParsedTrack {
  filePath: string;
  coverPath: string;
  extension: string;
  duration: number;
  bitrate: number;
  releaseArtist: string;
  trackArtist: string[];
  year: number;
  trackNo: number | null;
  trackTitle: string;
  releaseTitle: string;
  diskNo: number | null;
  label: string;
  genre: string[];
  catNo: string | null;
}

export type User = {
  appuser_id: number;
  name: string;
  settings: UserSettings;
};

export type UserSettings = {
  isLibLoaded: boolean;
};

export interface PaginatedDBResponse<Items> {
  total_count: number;
  items: Items[];
}

export interface PaginatedAPIResponse<Items> {
  totalCount: number;
  items: Items[];
}

export type UploadFiles = { releaseCover?: Express.Multer.File[] };

export type FilterParams = {
  yearIds: number[] | null;
  artistIds: number[] | null;
  labelIds: number[] | null;
  genreIds: number[] | null;
};
