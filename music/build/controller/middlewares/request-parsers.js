"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePaginationParams = exports.parseSortParams = void 0;
const constants_1 = require("../../utility/constants");
const helpers_1 = require("../../utility/helpers");
const validation_schemas_1 = require("../../model/public/validation-schemas");
function parseSortParams(req, res, next) {
    const [sortBy, sortOrder] = typeof req.query.sort === "string"
        ? req.query.sort.split(",").map((str) => helpers_1.styleCamelCase(str))
        : [constants_1.SORT_BY[0], constants_1.SORT_ORDER[0]];
    const sortParams = { sortBy, sortOrder };
    const { value, error } = validation_schemas_1.schemaSort.validate(sortParams);
    if (error) {
        next(error);
    }
    else {
        res.locals.sortParams = value;
        next();
    }
}
exports.parseSortParams = parseSortParams;
function parsePaginationParams(req, res, next) {
    const { page = 1, limit: itemsPerPage = constants_1.PER_PAGE_NUMS[0] } = req.query;
    const paginationParams = { page, itemsPerPage };
    const { value, error } = validation_schemas_1.schemaPaginate.validate(paginationParams);
    if (error) {
        next(error);
    }
    else {
        res.locals.paginationParams = value;
        next();
    }
}
exports.parsePaginationParams = parsePaginationParams;
//# sourceMappingURL=request-parsers.js.map