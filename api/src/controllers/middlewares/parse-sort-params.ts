import { Request, Response, NextFunction } from "express";

import { hyphenToUpperCase } from "../../utility";
import { schemaSort } from "../../models/validation-schemas";
import { SORT_BY, SORT_ORDER } from "../../config/constants";

export interface SortParams {
  sortBy: string;
  sortOrder: string;
}

export interface Sort {
  sortParams: SortParams;
}

export async function parseSortParams(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const defaultValues = [SORT_BY[0], SORT_ORDER[0]];
  const [sortBy, sortOrder] =
    typeof req.query.sort === "string"
      ? req.query.sort.split(",").map((str) => hyphenToUpperCase(str))
      : defaultValues;
  const sortParams = { sortBy, sortOrder };

  try {
    const value: SortParams = await schemaSort.validateAsync(sortParams);
    res.locals.sortParams = value;
    next();
  } catch (err) {
    next(err);
  }
}
