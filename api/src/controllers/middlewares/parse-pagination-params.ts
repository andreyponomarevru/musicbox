import { NextFunction, Request, Response } from "express";
import { PER_PAGE_NUMS } from "../../config/constants";

import Joi from "joi";

import { schemaPaginate } from "../../models/validation-schemas";

export interface PaginationParams {
  page: number;
  itemsPerPage: number;
}

export interface Pagination<Item> {
  paginationParams: PaginationParams;
  linkName: string;
  totalCount: number;
  collection: {
    items: Item[];
    totalCount: number;
  };
}

export async function parsePaginationParams(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { page = 1, limit: itemsPerPage = PER_PAGE_NUMS[0] } = req.query;

  const paginationParams = { page, itemsPerPage };

  try {
    const value: PaginationParams = await schemaPaginate.validateAsync(
      paginationParams,
    );
    res.locals.paginationParams = value;
    next();
  } catch (err) {
    next(err);
  }
}
