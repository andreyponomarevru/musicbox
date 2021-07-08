import Joi from "joi";

import { CreateTrack, UpdateTrack } from "./types";

const SUPPORTED_CODEC = (process.env.SUPPORTED_CODEC as string)
  .split(",")
  .map((name) => name.toLowerCase());

export const schemaCreateTrack = Joi.object<CreateTrack & UpdateTrack>({
  releaseId: Joi.number().integer().min(1),
  filePath: Joi.string().min(1).max(255).allow(null),
  extension: Joi.string().valid(...SUPPORTED_CODEC),
  artist: Joi.array().items(Joi.string().min(0).max(200)),
  duration: Joi.number().min(0),
  bitrate: Joi.number().min(0).allow(null),
  trackNo: Joi.number().integer().allow(null),
  title: Joi.string().min(0).max(200),
  diskNo: Joi.number().integer().allow(null),
  genre: Joi.array().items(Joi.string()),
}).options({ presence: "required" });

export const schemaUpdateTrack = schemaCreateTrack.keys({
  trackId: Joi.number().min(1).required().required,
});
