import express, { Request, Response, NextFunction } from "express";

import { HttpError } from "./../utility/http-errors/HttpError";
import * as APIQueriesForTrackDB from "../model/track/APIQueries";
import { Track } from "../model/track/localTrack";

const router = express.Router();

async function read(req: Request, res: Response, next: NextFunction) {
  try {
    const trackId = parseInt(req.params.id);
    if (isNaN(trackId)) throw new HttpError(422);
    const track = await APIQueriesForTrackDB.read(trackId);
    if (track) res.json(track.JSON);
    else throw new HttpError(404);
  } catch (err) {
    next(err);
  }
}

async function readAll(req: Request, res: Response, next: NextFunction) {
  try {
    const tracks = await APIQueriesForTrackDB.readAll({
      ...res.locals.sort,
      pagination: res.locals.pagination,
    });
    const tracksJSON = (tracks.results as any).map(
      (track: Track) => track.JSON,
    );

    const nextPageLink = `</tracks?page=${tracks.next_page}&per_page=${res.locals.pagination.itemsPerPage}>; rel='next'`;
    const prevPageLink = `</tracks?page=${tracks.previous_page}&per_page=${res.locals.pagination.itemsPerPage}>; rel='previous'`;
    const lastPageLink = `</tracks?page=${tracks.last_page}&per_page=${res.locals.pagination.itemsPerPage}>; rel='last'`;
    const firstPageLink = `</tracks?page=${tracks.first_page}&per_page=${res.locals.pagination.itemsPerPage}>; rel='first'`;

    res.set(
      "Link",
      `${nextPageLink}, ${prevPageLink}, ${lastPageLink}, ${firstPageLink}`,
    );
    res.set("X-Total-Count", `${tracks.total_count}`);
    res.json({
      page_number: tracks.page_number,
      total_page: tracks.total_pages,
      total_count: tracks.total_count,
      previous_page: tracks.previous_page
        ? `/tracks?page=${tracks.previous_page}`
        : null,
      next_page: tracks.next_page ? `/tracks?page=${tracks.next_page}` : null,
      first_page: tracks.first_page
        ? `/tracks?page=${tracks.first_page}`
        : null,
      last_page: tracks.last_page ? `/tracks?page=${tracks.last_page}` : null,
      results: tracksJSON,
    });
  } catch (err) {
    next(err);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const newTrack = await APIQueriesForTrackDB.create(req.body);
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

    const deletedTrackId = await APIQueriesForTrackDB.destroy(trackId);
    if (deletedTrackId) res.status(204).end();
    else throw new HttpError(404);
  } catch (err) {
    next(err);
  }
}

router.get("/", readAll);
router.get("/:id", read);
router.post("/", create);
//router.put("/:id", update);
router.delete("/:id", destroy);

export { router };
