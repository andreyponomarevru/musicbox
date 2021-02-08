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

  //[key: string]: null | string[] | string | number;
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
  trackArtist: string[];
  trackTitle: string;
  genre: string[];
  duration: number;
};

export type AddTrackInputNames = {
  [k in keyof AddTrack]: string | null;
};

export type AddRelease = {
  year: number;
  releaseArtist: string;
  releaseTitle: string;
  label: string;
  catNo: string;
};

export type AddReleaseInputNames = {
  [k in keyof AddRelease]: string | null;
};
