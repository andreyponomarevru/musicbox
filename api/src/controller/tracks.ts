import express, { Request, Response, NextFunction } from "express";

import { HttpError } from "./../utility/http-errors/HttpError";
import * as db from "../model/track/queries";
import {
  parseRequestSortParams,
  parseRequestInt,
} from "../utility/requestParsers";
import { ReadAllByPages } from "./../types";

const router = express.Router();

/*
async function createTrack(req: Request, res: Response, next: NextFunction) {
  try {
    const { filePath, coverPath, extension, trackArtist, releaseArtist, duration, bitrate, year, trackNo, trackTitle, releaseTitle, diskNo, label, genre, catNo } = req.body;

    let newTrack;

    for (const track of req.body.tracks) {
      const metadata = {
        year,
        label,
        catNo,
        releaseArtist,
        releaseTitle,
        ...track,
      }

      newTrack = await db.create(metadata);
    }
    
    const metadata = {
      filePath,
      coverPath,
      extension,
      trackArtist,
      releaseArtist,
      duration,
      bitrate,
      year,
      trackNo,
      trackTitle,
      releaseTitle,
      diskNo,
      label,
      genre,
      catNo,
    };

    res.set("location", `/tracks/${newTrack.getTrackId()}`);
    res.status(201);
    //res.json(newTrack.JSON);
  } catch (err) {
    next(err);
  }
}
*/

async function getTrack(req: Request, res: Response, next: NextFunction) {
  try {
    const trackId = parseInt(req.params.id);
    if (isNaN(trackId)) throw new HttpError(422);
    const track = await db.read(trackId);
    if (track) res.json(track.JSON);
    else throw new HttpError(404);
  } catch (err) {
    next(err);
  }
}

async function getTracks(req: Request, res: Response, next: NextFunction) {
  const { sortBy, sortOrder } = parseRequestSortParams(req.query.sort);
  const page = parseRequestInt(req.query.page);
  const itemsPerPage = parseRequestInt(req.query.limit);

  const reqParams = {
    sortBy: sortBy,
    sortOrder,
    pagination: {
      page,
      itemsPerPage,
    },
  };

  try {
    const { tracks } = await db.readAll(reqParams);
    const tracksJSON = tracks.map((track) => track.JSON);
    res.json({ tracks: tracksJSON });
  } catch (err) {
    next(err);
  }
}

async function updateTrack(req: Request, res: Response, next: NextFunction) {
  try {
    const trackId = parseInt(req.params.id);
    if (isNaN(trackId)) throw new HttpError(422);
    const metadata = req.body;

    /*
    const sanitizedMetadata = await getSanitizedMetadata(
      metadata,
    );
    */
    const updatedTrack = await db.update(metadata);

    res.set("location", `/tracks/${updatedTrack.getTrackId()}`);
    res.status(200);
    res.json(updatedTrack.JSON);
  } catch (err) {
    next(err);
  }
}

export async function destroyTrack(
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

//router.post("/", createTrack);
router.get("/:id", getTrack);
router.get("/", getTracks);
router.put("/:id", updateTrack);
router.delete("/:id", destroyTrack);

export { router };
