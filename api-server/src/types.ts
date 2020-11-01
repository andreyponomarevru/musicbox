import mm from "music-metadata";
import { validationSchema } from "model/track/validationSchema";

export type FilePath = string;
export type Extension = string | null;
export type Artist = string[] | [];
export type Duration = number | null;
export type Bitrate = number | null;
export type Year = number | null;
export type TrackNo = number | null;
export type Title = string | null;
export type Album = string | null;
export type DiskNo = number | null;
export type Label = string | null;
export type Genre = string[] | [];

export type MinMax = {
  min: number;
  max: number;
};

export type Includes = (string | number)[];

export interface TrackMetadata {
  filePath: FilePath;
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

export interface ValidationSchema {
  isLength?: ((sourceValue: string, target: MinMax) => boolean) | MinMax;
  isRange?: ((sourceValue: number, target: MinMax) => boolean) | MinMax;
  includes?:
    | ((sourceValue: string | number, target: Includes) => boolean)
    | Includes;
}

export interface RawMetadata extends mm.IAudioMetadata {
  filePath: string;
}
