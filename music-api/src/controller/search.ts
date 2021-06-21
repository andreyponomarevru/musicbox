import express, { Request, Response, NextFunction } from "express";

import * as queriesForTrackDB from "../model/public/find/queries";
import { parsePaginationParams } from "../controller/middlewares/parse-pagination-params";
import { sendPaginated } from "../controller/middlewares/send-paginated";
import { parseSortParams } from "../controller/middlewares/parse-sort-params";

const router = express.Router();

async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const query = String(req.query.q).toLowerCase();

    console.log(`Query is: ${query}`);

    const params = {
      ...res.locals.sortParams,
      ...res.locals.paginationParams,
    };
    res.locals.linkName = "tracks";
    res.locals.collection = await queriesForTrackDB.find(query, params);

    next();
  } catch (err) {
    next(err);
  }
}

router.get("/", parseSortParams, parsePaginationParams, search, sendPaginated);

export { router };
