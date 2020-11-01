import { ValidationSchema } from "./../../types";

const SUPPORTED_CODEC = (process.env.SUPPORTED_CODEC as string).split(",");

export const validationSchema: { [key: string]: ValidationSchema } = {
  filePath: {
    isLength: { min: 1, max: 255 },
  },

  extension: {
    includes: SUPPORTED_CODEC,
  },

  artist: {
    isLength: { min: 0, max: 200 },
  },

  year: {
    isRange: { min: 0, max: 9999 },
  },

  title: {
    isLength: { min: 0, max: 200 },
  },

  album: {
    isLength: { min: 0, max: 200 },
  },

  label: {
    isLength: { min: 0, max: 200 },
  },
};
