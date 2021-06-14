import express, { Request, Response, NextFunction } from "express";

import * as queriesForTrackDB from "../model/public/find/queries";
import { parsePaginationParams } from "../controller/middlewares/parse-pagination-params";
import { sendPaginated } from "../controller/middlewares/send-paginated";
import { parseSortParams } from "../controller/middlewares/parse-sort-params";

const router = express.Router();

// TODO: implement filtering
// All queries should be case Insensitive!!!
//
// Minimum query: "/search?q=aya&type=all" (all = release, artist, label;)
// Maximum query: "/search?q=aya&type=label&year=2004&genre=downtempo&genre=deep+house&year=2001&label=naked+music+recordings"
// Type can be "all", "release", "artist", "label"
// So, each click on filet on client side adds to the query the string like "&year=2004" i.e. "&[filterName]=[filterValue]"
//
// Working tested query that you can use for filtering:
// select * from tyear where tyear in (2001, 2005, 200);
// Read how to implement and take code form here: https://stackoverflow.com/questions/10720420/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query

// Filters; year, genre, label, artist
//    ?year=2018&year=9&genre=25&label=25&artist=16

async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const query = String(req.query.q).toLowerCase();

    const params = {
      ...res.locals.sortParams,
      ...res.locals.paginationParams,
    };
    res.locals.linkName = "tracks";
    res.locals.collection = await queriesForTrackDB.find(query, params);
    /*
    res.json({
      results: matchingTracks,
		});*/

    next();
  } catch (err) {
    next(err);
  }
}

router.get("/", parseSortParams, parsePaginationParams, search, sendPaginated);

export { router };
