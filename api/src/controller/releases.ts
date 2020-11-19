import express, { Request, Response, NextFunction } from "express";

import { HttpError } from "./../utility/http-errors/HttpError";
import * as db from "../model/release/queries";

const router = express.Router();
/*
async function createRelease(req: Request, res: Response, next: NextFunction) {
  try {
    const metadata = req.body;
    const newTrack = await db.create(metadata);

    res.set("location", `/tracks/${newTrack.getTrackId()}`);
    res.status(201);
    res.json(newTrack.JSON);
  } catch (err) {
    next(err);
  }
}
*/
/*
async function getRelease(req: Request, res: Response, next: NextFunction) {
  try {
    const trackId = parseInt(req.params.id);
    if (isNaN(trackId)) throw new HttpError(422);
    const track = await db.readAll(trackId);
    if (track) res.json(track.JSON);
    else throw new HttpError(404);
  } catch (err) {
    next(err);
  }
}
*/
async function getReleases(req: Request, res: Response, next: NextFunction) {
  try {
    if (
      typeof req.query.page === "string" &&
      typeof req.query.limit === "string"
    ) {
      const page = parseInt(req.query.page);
      const itemsPerPage = parseInt(req.query.limit);
      //const { tracks } = await db.readAllByPages(page, itemsPerPage);
      //const tracksJSON = tracks.map((track) => track.JSON);
      //res.json({ tracks: tracksJSON });
    } else {
      const { releases } = await db.readAll();
      const releasesJSON = releases.map((release) => release.JSON);
      res.json({ releases: releasesJSON });
    }
  } catch (err) {
    next(err);
  }
}
/*
async function updateRelease(req: Request, res: Response, next: NextFunction) {
  try {
    const trackId = parseInt(req.params.id);
    if (isNaN(trackId)) throw new HttpError(422);
    const metadata = req.body;

    /*
    const sanitizedMetadata = await getSanitizedMetadata(
      metadata,
    );
    //
    const updatedTrack = await db.update(metadata);

    res.set("location", `/tracks/${updatedTrack.getTrackId()}`);
    res.status(200);
    res.json(updatedTrack.JSON);
  } catch (err) {
    next(err);
  }
}


export async function destroyRelease(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const trackId = parseInt(req.params.id);
    if (isNaN(trackId)) throw new HttpError(422);

    const deletedTrackId = await db.destroy(trackId);
    if (deletedTrackId) res.status(204).end();
    else throw new HttpError(404);
  } catch (err) {
    next(err);
  }
}
*/
//router.post("/", createRelease);
//router.get("/:id", getRelease);
router.get("/", getReleases);
//router.put("/:id", updateRelease);
//router.delete("/:id", destroyRelease);

export { router };
