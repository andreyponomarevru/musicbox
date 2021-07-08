import {
  TrackId,
  ReleaseId,
  FilePath,
  Extension,
  TrackArtist,
  Duration,
  Bitrate,
  TrackNo,
  TrackTitle,
  DiskNo,
  Genre,
} from "../../../types";

export interface TrackMetaDBResponse {
  track_id: TrackId;
  release_id: ReleaseId;
  file_path: FilePath;
  extension: Extension;
  artist: TrackArtist;
  duration: Duration;
  bitrate: Bitrate;
  track_no: TrackNo;
  title: TrackTitle;
  disk_no: DiskNo;
  genre: Genre;
}

export interface TrackMeta {
  readonly filePath: FilePath;
  readonly extension: Extension;
  readonly artist: TrackArtist;
  readonly duration: Duration;
  readonly bitrate: Bitrate;
  readonly trackNo: TrackNo;
  readonly title: TrackTitle;
  readonly diskNo: DiskNo;
  readonly genre: Genre;
}

export interface UpdateTrack extends TrackMeta {
  readonly trackId: TrackId;
  readonly releaseId: ReleaseId;
}

export interface CreateTrack extends TrackMeta {
  readonly releaseId: ReleaseId;
}

export type FilterParams = {
  yearIds: number[] | null;
  artistIds: number[] | null;
  labelIds: number[] | null;
  genreIds: number[] | null;
};

export type FilePathDBResponse = { file_path: string };
