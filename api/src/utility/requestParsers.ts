import { NextFunction, Request, Response } from "express";

import { styleCamelCase } from "./../utility/helpers";

import { SORT_COLUMNS, PER_PAGE_NUMS, SORT_ORDER } from "./constants";

function parseRequestInt(value: unknown) {
  const r = typeof value === "string" ? parseInt(value) : undefined;
  return r;
}

export function sortParamsParser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  function parseRequestSortParams(value: unknown) {
    const sortParams = typeof value === "string" ? value.split(",") : undefined;
    const sortBy = sortParams ? styleCamelCase(sortParams[0]) : undefined;
    const sortOrder = sortParams ? styleCamelCase(sortParams[1]) : undefined;

    return { sortBy, sortOrder };
  }

  const {
    sortBy = SORT_COLUMNS[0],
    sortOrder = SORT_ORDER[0],
  } = parseRequestSortParams(req.query.sort);

  res.locals.sort = {
    sortBy,
    sortOrder,
  };
  next();
}

export function paginationParser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const page = parseRequestInt(req.query.page) || 1;
  const itemsPerPage = parseRequestInt(req.query.limit) || PER_PAGE_NUMS[0];

  res.locals.pagination = {
    page,
    itemsPerPage,
  };
  next();
}
