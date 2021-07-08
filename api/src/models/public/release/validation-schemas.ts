import Joi from "joi";

import { ReleaseMeta } from "./types";

export const schemaCreateRelease = Joi.object<ReleaseMeta>({
  artist: Joi.string().min(0).max(200),
  year: Joi.number()
    .integer()
    .min(0)
    .max(new Date().getFullYear() + 1)
    .required()
    .optional(),
  title: Joi.string().min(0).max(200),
  label: Joi.string().min(0).max(200),
  coverPath: Joi.string().optional(),
  catNo: Joi.string().max(255).allow(null),
}).options({ presence: "required" });

export const schemaUpdateRelease = schemaCreateRelease.keys({
  id: Joi.number().integer().min(1).required(),
});
