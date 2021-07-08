import express, { Request, Response, NextFunction } from "express";

import * as queriesForTrackDB from "../models/public/search/queries";
import { parsePaginationParams } from "./middlewares/parse-pagination-params";
import { sendPaginated } from "./middlewares/send-paginated";
import { parseSortParams } from "./middlewares/parse-sort-params";
import { schemaSearchQuery } from "../models/validation-schemas";

const router = express.Router();

async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const query = String(req.query.q).toLowerCase();
    const validQuery: string = await schemaSearchQuery.validateAsync(query);

    const params = {
      ...res.locals.sortParams,
      ...res.locals.paginationParams,
    };
    res.locals.linkName = "tracks";
    res.locals.collection = await queriesForTrackDB.search(validQuery, params);
    next();
  } catch (err) {
    next(err);
  }
}

router.get("/", parseSortParams, parsePaginationParams, search, sendPaginated);

export { router };
