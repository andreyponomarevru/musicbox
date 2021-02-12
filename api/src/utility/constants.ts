export const SUPPORTED_CODEC = (process.env.SUPPORTED_CODEC as string)
  .split(",")
  .map((name) => name.toLowerCase());
export const API_SERVER_PORT = Number(process.env.API_SERVER_PORT);
export const MUSIC_LIB_DIR = process.env.MUSIC_LIB_DIR!;
export const IMG_LOCAL_DIR = process.env.IMG_LOCAL_DIR!;
export const IMG_DIR_URL = process.env.IMG_DIR_URL!;

export const DEFAULT_COVER_URL = process.env.DEFAULT_COVER_PATH!;
export const DEFAULT_USER_NAME = process.env.DEFAULT_USER_NAME!;
export const DEFAULT_USER_ID = Number(process.env.DEFAULT_USER_ID);

export const SORT_BY = [
  "year",
  "artist",
  "title",
  "trackArtist",
  "trackTitle",
  "releaseArtist",
  "releaseTitle",
];
export const PER_PAGE_NUMS = [25, 50, 100, 250, 500];
export const SORT_ORDER = ["desc", "asc"];
