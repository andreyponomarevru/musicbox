// fix error "Augmentations for the global scope can only be directly nested in external modules or ambient module declarations"
export {};

//

declare global {
  type TrackTitle = string;
  type ReleaseTitle = string;
  type Year = number;
  type ReleaseId = number;
  type Label = string;
  type CoverPath = string;
  type CatNo = string | null;
  type ReleaseArtist = string;
  type TrackArtist = string[];
  type Duration = number;
  type Genre = string[];
  type DiskNo = number | null;
  type TrackNo = number | null;
  type Bitrate = number;
  type Extension = string;
  type FilePath = string | null;
  type TrackId = number;

  interface TrackMetadata {
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

  interface TrackExtendedMetadata {
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

  interface ReleaseMetadata {
    id: ReleaseId;
    artist: ReleaseArtist;
    year: Year;
    title: ReleaseTitle;
    label: Label;
    catNo: CatNo;
    coverPath: CoverPath;
  }

  type Stats = { id: number; name: string; tracks: number };

  type DatabaseStats = {
    releases: number;
    tracks: number;
    artists: number;
    labels: number;
    genres: number;
  };

  type AddTrack = {
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

  type AddTrackInputNames = {
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

  type AddReleaseInputNames = {
    [k in keyof AddRelease]: string | null | File;
  };

  type Layout = "grid" | "list" | "search";

  // API

  type APIError = {
    errorCode: number;
    message: string;
  };

  interface NotPaginatedAPIResponse<Results> {
    results: Results;
  }

  interface PaginatedAPIResponse<Results> {
    page_number: number | null;
    total_pages: number;
    total_count: number;
    previous_page: string | null;
    next_page: string | null;
    first_page: string | null;
    last_page: string | null;
    results: Results;
  }

  interface APIResponse<Results> {
    error: APIError | null;
    isLoading: boolean;
    response: Results | null;
  }
}
