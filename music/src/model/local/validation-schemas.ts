import Joi from "joi";

import {
  SORT_BY,
  SORT_ORDER,
  PER_PAGE_NUMS,
  SUPPORTED_CODEC,
} from "./../../utility/constants";

/*
 * Schemas used in Model
 */

export const schemaImportLocalTrack = Joi.object({
  filePath: Joi.string().min(0).max(255).allow(null).optional(),
  extension: Joi.string()
    .valid(...SUPPORTED_CODEC)
    .optional(),
  trackArtist: Joi.array().items(Joi.string().min(0).max(200)).optional(),
  releaseArtist: Joi.string().min(1).max(200).optional(),
  duration: Joi.number().min(0).optional(),
  bitrate: Joi.number().min(0).allow(null).optional(),
  year: Joi.number().integer().min(0).max(9999).required(),
  trackNo: Joi.number().allow(null).optional(),
  trackTitle: Joi.string().min(0).max(200).optional(),
  releaseTitle: Joi.string().min(0).max(200).optional(),
  diskNo: Joi.number().allow(null).optional(),
  label: Joi.string().min(0).max(200).optional(),
  genre: Joi.array().items(Joi.string()).optional(),
  coverPath: Joi.string().optional(),
  catNo: Joi.allow(null).optional(),
});
