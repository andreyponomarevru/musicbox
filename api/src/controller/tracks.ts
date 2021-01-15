import express, { Request, Response, NextFunction } from "express";

import { HttpError } from "./../utility/http-errors/HttpError";
import * as db from "../model/track/queries";
import * as trackDB from "../model/track/queries";
import {
  parseRequestSortParams,
  parseRequestInt,
} from "../utility/requestParsers";
import { ReadAllByPages, TrackMetadata } from "./../types";
import { SORT_COLUMNS, PER_PAGE_NUMS, SORT_ORDER } from "../utility/constants";

const router = express.Router();

/*
async function create(req: Request, res: Response, next: NextFunction) {
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

async function read(req: Request, res: Response, next: NextFunction) {
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

async function readAll(req: Request, res: Response, next: NextFunction) {
  const {
    sortBy = SORT_COLUMNS[0],
    sortOrder = SORT_ORDER[0],
  } = parseRequestSortParams(req.query.sort);
  const page = parseRequestInt(req.query.page) || 1;
  const itemsPerPage = parseRequestInt(req.query.limit) || PER_PAGE_NUMS[0];

  const reqParams = {
    sortBy: sortBy,
    sortOrder,
    pagination: {
      page,
      itemsPerPage,
    },
  };

  try {
    const tracks = await trackDB.readAll(reqParams);
    const tracksJSON = tracks.results.map((track) => track.JSON);

    const nextPageLink = `</releases?page=${
      tracks.total_pages > page ? page + 1 : null
    }&per_page=${itemsPerPage}>; rel='next'`;
    const prevPageLink = `</releases?page=${
      tracks.page_number > 1 ? tracks.page_number - 1 : null
    }&per_page=${itemsPerPage}>; rel='previous'`;
    const lastPageLink = `</releases?page=${tracks.last_page}&per_page=${itemsPerPage}>; rel='last'`;

    res.set("Link", `${nextPageLink}, ${prevPageLink}, ${lastPageLink}`);
    res.set("X-Total-Count", `${tracksJSON.length}`);
    res.json({
      page_number: tracks.page_number,
      total_page: tracks.total_pages,
      total_count: tracks.total_count,
      previous_page: tracks.previous_page,
      next_page: tracks.next_page,
      last_page: tracks.last_page,
      results: tracksJSON,
    });
  } catch (err) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
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

export async function destroy(req: Request, res: Response, next: NextFunction) {
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

//router.post("/", create);
router.get("/", readAll);

router.get("/:id", read);
router.put("/:id", update);
router.delete("/:id", destroy);

export { router };
