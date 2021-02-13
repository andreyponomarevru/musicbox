import { NextFunction, Request, Response } from "express";
import { SORT_BY, PER_PAGE_NUMS, SORT_ORDER } from "../../utility/constants";
import { styleCamelCase } from "../helpers";
import {
  schemaSort,
  schemaPaginate,
} from "./../../model/public/validation-schemas";

export function parseSortParams(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const [sortBy, sortOrder] =
    typeof req.query.sort === "string"
      ? req.query.sort.split(",").map((str) => styleCamelCase(str))
      : [SORT_BY[0], SORT_ORDER[0]];

  const sortParams = { sortBy, sortOrder };
  const { value, error } = schemaSort.validate(sortParams);

  if (error) {
    next(error);
  } else {
    res.locals.sortParams = value;
    next();
  }
}

export function parsePaginationParams(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { page = 1, limit: itemsPerPage = PER_PAGE_NUMS[0] } = req.query;

  const paginationParams = { page, itemsPerPage };
  const { value, error } = schemaPaginate.validate(paginationParams);

  if (error) {
    next(error);
  } else {
    res.locals.paginationParams = value;
    next();
  }
}
