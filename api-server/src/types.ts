import mm from "music-metadata";

export type TrackId = number;
export type FilePath = string;
export type Extension = string | "Unknown";
export type Artist = string[] | ["Unknown"];
export type Duration = number | null;
export type Bitrate = number | null;
export type Year = number;
export type TrackNo = number | null;
export type Title = string | null;
export type Album = string | null;
export type DiskNo = number | null;
export type Label = string | "Unknown";
export type Genre = string[] | ["Unknown"];
export type PicturePath = string;

export interface ExtendedIAudioMetadata extends mm.IAudioMetadata {
  filePath: string;
  picturePath: string | null;
}

export interface TrackMetadata {
  trackId?: TrackId;
  filePath: FilePath;
  picturePath: PicturePath;
  extension: Extension;
  artist: Artist;
  duration: Duration;
  bitrate: Bitrate;
  year: Year;
  trackNo: TrackNo;
  title: Title;
  album: Album;
  diskNo: DiskNo;
  label: Label;
  genre: Genre;
}

export interface TrackPicture {
  picturePath: string;
  data: Buffer;
}

export type MinMax = {
  min: number;
  max: number;
};

export type Includes = (string | number)[];

export interface ValidationSchema {
  isLength?: ((sourceValue: string, target: MinMax) => boolean) | MinMax;
  isRange?: ((sourceValue: number, target: MinMax) => boolean) | MinMax;
  includes?:
    | ((sourceValue: string | number, target: Includes) => boolean)
    | Includes;
}
