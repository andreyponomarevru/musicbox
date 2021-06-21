import { NextFunction, Request, Response } from "express";
import { PER_PAGE_NUMS } from "../../config/constants";

import Joi from "joi";

import { schemaPaginate } from "../../model/public/validation-schemas";

export interface PaginationParams {
  page: number;
  itemsPerPage: number;
}

export interface Pagination<ItemType> {
  paginationParams: PaginationParams;
  linkName: string;
  totalCount: number;
  collection: {
    items: ItemType[];
    totalCount: number;
  };
}

type JoiValidation = {
  value: PaginationParams;
  error?: Joi.ValidationError;
};

export function parsePaginationParams(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { page = 1, limit: itemsPerPage = PER_PAGE_NUMS[0] } = req.query;

  const paginationParams = { page, itemsPerPage };
  const { value, error }: JoiValidation =
    schemaPaginate.validate(paginationParams);

  if (error) {
    next(error);
  } else {
    res.locals.paginationParams = value;
    next();
  }
}
