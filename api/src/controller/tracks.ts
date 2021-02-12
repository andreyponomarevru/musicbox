import express, { Request, Response, NextFunction } from "express";

import { HttpError } from "./../utility/http-errors/HttpError";
import * as apiQueriesForTrackDB from "../model/track/APIQueries";
import { Track } from "../model/track/localTrack";
import {
  parseSortParams,
  parsePaginationParams,
} from "../utility/middlewares/request-parsers";
import { sendPaginated } from "../utility/middlewares/send-paginated";

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

/*
async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const trackId = parseInt(req.params.id);
    if (isNaN(trackId)) throw new HttpError(422);
    const metadata = req.body;

    
    //const sanitizedMetadata = await getSanitizedMetadata(
    //  metadata,
    //);
    
    const updatedTrack = await db.update(metadata);

    res.set("location", `/tracks/${updatedTrack.getTrackId()}`);
    res.status(200);
    res.json(updatedTrack.JSON);
  } catch (err) {
    next(err);
  }
}
*/

async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const trackId = parseInt(req.params.id);
    if (isNaN(trackId)) throw new HttpError(422);

    const deletedTrackId = await apiQueriesForTrackDB.destroy(trackId);
    if (deletedTrackId) res.status(204).end();
    else throw new HttpError(404);
  } catch (err) {
    next(err);
  }
}

router.get("/", parseSortParams, parsePaginationParams, readAll, sendPaginated);
router.get("/:id", read);
router.post("/", create);
//router.put("/:id", update);
router.delete("/:id", destroy);

export { router };
