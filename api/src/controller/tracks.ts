import express, { Request, Response, NextFunction } from "express";

import { HttpError } from "./../utility/http-errors/HttpError";
import * as apiQueriesForTrackDB from "../model/public/track/queries";
import {
  parseSortParams,
  parsePaginationParams,
} from "../utility/middlewares/request-parsers";
import { sendPaginated } from "../utility/middlewares/send-paginated";
import {
  schemaId,
  schemaUpdateTrack,
} from "./../model/public/validation-schemas";

const router = express.Router();

async function read(req: Request, res: Response, next: NextFunction) {
  try {
    const trackId = parseInt(req.params.id);
    if (isNaN(trackId)) throw new HttpError(422);
    const track = await apiQueriesForTrackDB.read(trackId);
    if (track) res.json(track.JSON);
    else throw new HttpError(404);
  } catch (err) {
    next(err);
  }
}

async function readAll(req: Request, res: Response, next: NextFunction) {
  try {
    res.locals.collection = await apiQueriesForTrackDB.readAll({
      ...res.locals.sortParams,
      ...res.locals.paginationParams,
    });
    res.locals.linkName = "tracks";

    next();
  } catch (err) {
    next(err);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const newTrack = await apiQueriesForTrackDB.create(req.body);
    res.set("Location", `/tracks/${newTrack.getTrackId()}`);
    res.status(201);
    res.json({ results: newTrack.JSON });
  } catch (err) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const trackId: number = await schemaId.validateAsync(req.params.id);
    const metadata = await schemaUpdateTrack.validateAsync({
      trackId,
      ...req.body,
    });
    //const sanitizedMetadata = await getSanitizedMetadata(
    //  metadata,
    //);
    const updatedTrack = await apiQueriesForTrackDB.update(metadata);
    res.set("location", `/tracks/${updatedTrack.getTrackId()}`);
    res.status(200);
    res.json(updatedTrack.JSON);
  } catch (err) {
    next(err);
  }
}

async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const trackId: number = await schemaId.validateAsync(req.params.id);
    const deletedTrackId = await apiQueriesForTrackDB.destroy(trackId);
    if (deletedTrackId) res.status(204).end();
    else throw new HttpError(404);
  } catch (err) {
    next(err);
  }
}

router.post("/", create);
router.get("/", parseSortParams, parsePaginationParams, readAll, sendPaginated);
router.get("/:id", read);
router.put("/:id", update);
router.delete("/:id", destroy);

export { router };
