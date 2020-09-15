const SUPPORTED_CODEC = process.env.SUPPORTED_CODEC.split(",");

const validationSchema = {
  filePath: {
    isType: ["string"],
    isRequired: true,
    isLength: { min: 1, max: 255 },
  },
  year: {
    isType: ["integer", null],
    isRange: { min: 0, max: 9999 },
  },
  extension: {
    includes: SUPPORTED_CODEC,
  },
  artist: {
    isType: ["string", null],
    isLength: { min: 0, max: 200 },
  },
  duration: {
    isType: ["number", null],
  },
  bitrate: {
    isType: ["number"],
  },
  trackNo: {
    isType: ["number", null],
  },
  title: {
    isType: ["string", null],
    isLength: { min: 0, max: 200 },
  },
  album: {
    isType: ["string", null],
    isLength: { min: 0, max: 200 },
  },
  diskNo: {
    isType: ["number", null],
  },
  label: {
    isType: ["string", null],
    isLength: { min: 0, max: 200 },
  },
  genre: {
    isType: ["array", null],
  },
};

module.exports.validationSchema = validationSchema;
