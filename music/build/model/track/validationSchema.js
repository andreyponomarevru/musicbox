"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const SUPPORTED_CODEC = process.env.SUPPORTED_CODEC.split(",");
exports.validationSchema = {
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
//# sourceMappingURL=validationSchema.js.map