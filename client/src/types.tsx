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

export interface TrackMetadata {
  releaseId?: number;
  trackId?: number;

  filePath: FilePath;
  extension: Extension;
  artist: TrackArtist;
  duration: Duration;
  bitrate: Bitrate;
  trackNo: TrackNo;
  diskNo: DiskNo;
  title: TrackTitle;
  genre: Genre;
}

export interface TrackExtendedMetadata {
  trackId: number;
  releaseId: number;

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

export interface ReleaseMetadata {
  id: ReleaseId;
  artist: ReleaseArtist;
  year: Year;
  title: ReleaseTitle;
  label: Label;
  catNo: CatNo;
  coverPath: CoverPath;
}

export type Stats = { id: number; name: string; tracks: number };

export type DatabaseStats = {
  releases: number;
  tracks: number;
  artists: number;
  labels: number;
  genres: number;
};

export type AddTrack = {
  trackNo: number;
  artist: string[];
  title: string;
  genre: string[];
  duration: number;
  filePath: string | null;
  extension: string;
  bitrate: number;
  diskNo: number;
};

export type AddTrackInputNames = {
  [k in keyof AddTrack]: string | number | null;
};

type AddRelease = {
  year: number;
  artist: string;
  title: string;
  label: string;
  catNo: string;
  cover: File;
};

export type AddReleaseInputNames = {
  [k in keyof AddRelease]: string | null | File;
};

export type Layout = "grid" | "list" | "search";

// API

export type APIError = {
  errorCode: number;
  message: string;
};

export interface NotPaginatedAPIResponse<Results> {
  results: Results;
}

export interface PaginatedAPIResponse<Results> {
  pageNumber: number | null;
  totalPpages: number;
  totalCount: number;
  previousPage: string | null;
  nextPage: string | null;
  firstPage: string | null;
  lastPage: string | null;
  results: Results;
}

export interface APIResponse<Results> {
  error: APIError | null;
  isLoading: boolean;
  response: Results | null;
}

export type Filters = {
  years: number[];
  genres: number[];
  labels: number[];
  artists: number[];
};

export type FilterNames = {
  years: string;
  artists: string;
  labels: string;
  genres: string;
};

export type PaginationParams = {
  totalCount: number;
  previousPage: string | null;
  nextPage: string | null;
};
