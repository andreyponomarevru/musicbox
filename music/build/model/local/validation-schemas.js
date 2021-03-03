"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaImportLocalTrack = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("./../../utility/constants");
/*
 * Schemas used in Model
 */
exports.schemaImportLocalTrack = joi_1.default.object({
    filePath: joi_1.default.string().min(0).max(255).allow(null).optional(),
    extension: joi_1.default.string()
        .valid(...constants_1.SUPPORTED_CODEC)
        .optional(),
    trackArtist: joi_1.default.array().items(joi_1.default.string().min(0).max(200)).optional(),
    releaseArtist: joi_1.default.string().min(1).max(200).optional(),
    duration: joi_1.default.number().min(0).optional(),
    bitrate: joi_1.default.number().min(0).allow(null).optional(),
    year: joi_1.default.number().integer().min(0).max(9999).required(),
    trackNo: joi_1.default.number().allow(null).optional(),
    trackTitle: joi_1.default.string().min(0).max(200).optional(),
    releaseTitle: joi_1.default.string().min(0).max(200).optional(),
    diskNo: joi_1.default.number().allow(null).optional(),
    label: joi_1.default.string().min(0).max(200).optional(),
    genre: joi_1.default.array().items(joi_1.default.string()).optional(),
    coverPath: joi_1.default.string().optional(),
    catNo: joi_1.default.allow(null).optional(),
});
//# sourceMappingURL=validation-schemas.js.map