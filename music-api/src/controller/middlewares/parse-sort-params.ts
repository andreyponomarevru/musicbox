import { Request, Response, NextFunction } from "express";

import Joi from "joi";

import { hyphenToUpperCase } from "../../utility";
import { schemaSort } from "../../model/public/validation-schemas";
import { SORT_BY, SORT_ORDER } from "../../config/constants";

export interface SortParams {
  sortBy: string;
  sortOrder: string;
}

export interface Sort {
  sortParams: SortParams;
}

type JoiValidation = {
  value: SortParams;
  error?: Joi.ValidationError;
};

export function parseSortParams(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const defaultValues = [SORT_BY[0], SORT_ORDER[0]];
  const [sortBy, sortOrder] =
    typeof req.query.sort === "string"
      ? req.query.sort.split(",").map((str) => hyphenToUpperCase(str))
      : defaultValues;
  const sortParams = { sortBy, sortOrder };

  const { value, error }: JoiValidation = schemaSort.validate(sortParams);

  if (error) {
    next(error);
  } else {
    res.locals.sortParams = value;
    next();
  }
}
