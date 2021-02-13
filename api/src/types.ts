import * as mm from "music-metadata";
import { ReleaseShort } from "./model/public/release/ReleaseShort";
import { Track } from "./model/public/track/Track";

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

export interface ReleaseMetadata {
  id?: ReleaseId;
  artist: ReleaseArtist;
  year: Year;
  title: ReleaseTitle;
  label: Label;
  catNo: CatNo;
  coverPath: CoverPath;
}

export interface ReleaseShortMetadata {
  id: number;
  year: Year;
  artist: ReleaseArtist;
  title: ReleaseTitle;
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

/*
 * Pagination
 */

export interface SortParams {
  sortBy: string;
  sortOrder: string;
}

export interface PaginationParams {
  page: number;
  itemsPerPage: number;
}

//

// delete it? unused. Maybe used by sanitizer
export interface ParseCover extends mm.IPicture {
  name: string;
}

// delete it? unused. Maybe used by sanitizer
export interface ExtendedIAudioMetadata extends mm.IAudioMetadata {
  filePath: FilePath;
  coverPath: CoverPath;
  catNo: CatNo;
}

export interface Collection {
  items: ReleaseShort[] | Track[];
  totalCount: number;
}
