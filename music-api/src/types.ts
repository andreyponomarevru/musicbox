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

export interface TrackMeta {
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

export interface TrackExtendedMeta {
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

export interface ReleaseMeta {
  id: number;
  year: Year;
  artist: ReleaseArtist;
  title: ReleaseTitle;
  coverPath: CoverPath;
}

export interface ReleaseExtendedMeta {
  id?: ReleaseId;
  artist: ReleaseArtist;
  year: Year;
  title: ReleaseTitle;
  label: Label;
  catNo: CatNo;
  coverPath: CoverPath;
}

export type ReleaseCollection = {
  releases: ReleaseMeta[] | null;
  total_count: number;
};

//
// File uploading
//

export type UploadFiles = { releaseCover?: Express.Multer.File[] };
