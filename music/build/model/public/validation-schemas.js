"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaCatNo = exports.schemaId = exports.schemaUpdateTrack = exports.schemaCreateTrack = exports.schemaUpdateRelease = exports.schemaCreateRelease = exports.schemaSortAndPaginate = exports.schemaPaginate = exports.schemaSort = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("./../../utility/constants");
/*
 * Schemas used in pagination middlewares
 */
exports.schemaSort = joi_1.default.object()
    .keys({
    sortBy: joi_1.default.string()
        .valid(...constants_1.SORT_BY)
        .messages({
        "string.base": `"sort" must be a type of 'string'`,
        "any.only": `"sort" must be one of [${constants_1.SORT_BY.join(", ")}]`,
        "any.required": `"sort" is required`,
    }),
    sortOrder: joi_1.default.string()
        .valid(...constants_1.SORT_ORDER)
        .messages({
        "string.base": `"sort" must be a type of 'string'`,
        "any.only": `Sort order in "sort" must be one of [${constants_1.SORT_ORDER.join(", ")}]`,
        "any.required": `Sort order in "sort" is required`,
    }),
})
    .options({ presence: "required" });
exports.schemaPaginate = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).messages({
        "number.base": `"page" must be a type of 'number'`,
        "number.integer": `"page" must be an integer`,
        "number.min": `"page" minimum value is "1"`,
        "any.required": `"page" is required`,
    }),
    itemsPerPage: joi_1.default.number()
        .integer()
        .valid(...constants_1.PER_PAGE_NUMS)
        .messages({
        "number.base": `"limit" must be a type of 'number'`,
        "number.integer": `"limit" must be an integer`,
        "any.only": `"limit" must be one of [${constants_1.PER_PAGE_NUMS.join(", ")}]`,
        "any.required": `"limit" is required`,
    }),
}).options({ presence: "required" });
exports.schemaSortAndPaginate = joi_1.default.object({
    sortBy: joi_1.default.string().valid(...constants_1.SORT_BY),
    sortOrder: joi_1.default.string().valid(...constants_1.SORT_ORDER),
    page: joi_1.default.number().integer().min(1).optional(),
    itemsPerPage: joi_1.default.number()
        .integer()
        .valid(...constants_1.PER_PAGE_NUMS),
});
/*
 * Schemas used in Model/Controller
 */
exports.schemaCreateRelease = joi_1.default.object({
    artist: joi_1.default.string().min(0).max(200),
    year: joi_1.default.number()
        .integer()
        .min(0)
        .max(new Date().getFullYear() + 1)
        .required()
        .optional(),
    title: joi_1.default.string().min(0).max(200),
    label: joi_1.default.string().min(0).max(200),
    coverPath: joi_1.default.string().optional(),
    catNo: joi_1.default.string().max(255).allow(null),
}).options({ presence: "required" });
exports.schemaUpdateRelease = exports.schemaCreateRelease.keys({
    id: joi_1.default.number().integer().min(1).required(),
});
exports.schemaCreateTrack = joi_1.default.object({
    releaseId: joi_1.default.number().integer().min(1),
    filePath: joi_1.default.string().min(1).max(255).allow(null).optional(),
    extension: joi_1.default.string()
        .valid(...constants_1.SUPPORTED_CODEC)
        .optional(),
    artist: joi_1.default.array().items(joi_1.default.string().min(0).max(200)),
    duration: joi_1.default.number().min(0),
    bitrate: joi_1.default.number().min(0).allow(null),
    trackNo: joi_1.default.number().integer().allow(null),
    title: joi_1.default.string().min(0).max(200),
    diskNo: joi_1.default.number().integer().allow(null),
    genre: joi_1.default.array().items(joi_1.default.string()),
}).options({ presence: "required" });
exports.schemaUpdateTrack = exports.schemaCreateTrack.keys({
    trackId: joi_1.default.number().min(1).required(),
    releaseId: joi_1.default.number().integer().min(1).optional(),
});
exports.schemaId = joi_1.default.number().integer().min(1).required().messages({
    "number.base": `"id" must be a type of 'number'`,
    "number.integer": `"id" must be an integer`,
    "number.min": `"id" minimum value is "1"`,
    "any.required": `"id" is required`,
});
exports.schemaCatNo = joi_1.default.string().min(1).max(255).required().messages({
    "string.base": `"catNo" must be a type of 'string'`,
    "number.min": `"catNo" min length is 1 symbol`,
    "number.max": `"catNo" max length is 255 symbols`,
    "any.required": `"id" is required`,
});
//# sourceMappingURL=validation-schemas.js.map