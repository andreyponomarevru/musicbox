import Joi from "joi";

import { SORT_BY, SORT_ORDER, PER_PAGE_NUMS } from "../config/constants";
import { FilterParams } from "../types";

export const schemaSort = Joi.object()
  .keys({
    sortBy: Joi.string()
      .valid(...SORT_BY)
      .messages({
        "string.base": `"sort" must be a type of 'string'`,
        "any.only": `"sort" must be one of [${SORT_BY.join(", ")}]`,
        "any.required": `"sort" is required`,
      }),
    sortOrder: Joi.string()
      .valid(...SORT_ORDER)
      .messages({
        "string.base": `"sort" must be a type of 'string'`,
        "any.only": `Sort order in "sort" must be one of [${SORT_ORDER.join(
          ", ",
        )}]`,
        "any.required": `Sort order in "sort" is required`,
      }),
  })
  .options({ presence: "required" });

export const schemaPaginate = Joi.object<{
  page: number;
  itemsPerPage: number;
}>({
  page: Joi.number().integer().min(1).messages({
    "number.base": `"page" must be a type of 'number'`,
    "number.integer": `"page" must be an integer`,
    "number.min": `"page" minimum value is "1"`,
    "any.required": `"page" is required`,
  }),
  itemsPerPage: Joi.number()
    .integer()
    .valid(...PER_PAGE_NUMS)
    .messages({
      "number.base": `"limit" must be a type of 'number'`,
      "number.integer": `"limit" must be an integer`,
      "any.only": `"limit" must be one of [${PER_PAGE_NUMS.join(", ")}]`,
      "any.required": `"limit" is required`,
    }),
}).options({ presence: "required" });

//

export const schemaId = Joi.number().integer().min(1).required().messages({
  "number.base": `"id" must be a type of 'number'`,
  "number.integer": `"id" must be an integer`,
  "number.min": `"id" minimum value is "1"`,
  "any.required": `"id" is required`,
});

export const schemaCatNo = Joi.string().min(1).max(255).required().messages({
  "string.base": `"catNo" must be a type of 'string'`,
  "number.min": `"catNo" min length is 1 symbol`,
  "number.max": `"catNo" max length is 255 symbols`,
  "any.required": `"id" is required`,
});

export const schemaFilterParams = Joi.object<FilterParams>()
  .keys({
    yearIds: Joi.array().items(Joi.number()).allow(null),
    artistIds: Joi.array().items(Joi.number()).allow(null),
    labelIds: Joi.array().items(Joi.number()).allow(null),
    genreIds: Joi.array().items(Joi.number()).allow(null),
  })
  .options({ presence: "required" });

export const schemaSearchQuery = Joi.string()
  .min(2)
  .max(30)
  .lowercase()
  .required();
