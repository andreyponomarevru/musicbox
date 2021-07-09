import express, { Request, Response, NextFunction } from "express";

import { HttpError } from "./middlewares/http-errors/HttpError";
import * as apiQueriesForTrackDB from "../models/public/track/queries";
import { parsePaginationParams } from "./middlewares/parse-pagination-params";
import { parseSortParams } from "./middlewares/parse-sort-params";
import { sendPaginated } from "./middlewares/send-paginated";
import { streamChunked } from "./stream-audio";
import { parseFilterIDs } from "../utility/index";
import { schemaId, schemaFilterParams } from "../models/validation-schemas";
import { FilterParams } from "../types";

const router = express.Router();

async function stream(req: Request, res: Response, next: NextFunction) {
  try {
    const trackId = Number(req.params.id);
    const validTrackId: number = await schemaId.validateAsync(trackId);
    // TODO: cache trackFilePath in local var
    const trackFilePath = await apiQueriesForTrackDB.getFilePath(validTrackId);

    if (trackFilePath) {
      await streamChunked(req, res, trackFilePath.filePath);
    } else {
      throw new HttpError(404);
    }
  } catch (err) {
    next(err);
  }
}

async function readAll(req: Request, res: Response, next: NextFunction) {
  try {
    const filterParams = {
      yearIds: parseFilterIDs(req.query.years),
      artistIds: parseFilterIDs(req.query.artists),
      labelIds: parseFilterIDs(req.query.labels),
      genreIds: parseFilterIDs(req.query.genres),
    };

    const validFilterParams: FilterParams =
      await schemaFilterParams.validateAsync(filterParams);

    const params = {
      sort: res.locals.sortParams,
      pagination: res.locals.paginationParams,
      filters: validFilterParams,
    };

    res.locals.collection = await apiQueriesForTrackDB.filter(params);
    res.locals.linkName = "tracks";

    next();
  } catch (err) {
    next(err);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const metadata = req.body;
    const newTrack = await apiQueriesForTrackDB.create(metadata);
    res.set("Location", `/tracks/${newTrack.trackId}`);
    res.status(201);
    res.json({ results: newTrack.JSON });
  } catch (err) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const validId = await schemaId.validateAsync(id);
    const newMeta = req.body; // TODO: validate req.body with Joi
    const updatedTrack = await apiQueriesForTrackDB.update(validId, newMeta);
    res.set("location", `/tracks/${updatedTrack.trackId}`);
    res.status(200);
    res.json({ results: updatedTrack.JSON });
  } catch (err) {
    next(err);
  }
}

async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const trackId = Number(req.params.id);
    const validTrackId = await schemaId.validateAsync(trackId);
    const deletedTrackId = await apiQueriesForTrackDB.destroy(validTrackId);

    if (deletedTrackId) {
      res.status(204).end();
    } else {
      throw new HttpError(404);
    }
  } catch (err) {
    next(err);
  }
}

router.post("/", create);
router.get("/", parseSortParams, parsePaginationParams, readAll, sendPaginated);
router.get("/:id/stream", stream);
router.put("/:id", update);
router.delete("/:id", destroy);

export { router };
