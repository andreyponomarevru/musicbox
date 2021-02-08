import util from "util";

import express, { Request, Response, NextFunction } from "express";

import { HttpError } from "./../utility/http-errors/HttpError";
import * as releaseAPIQueriesForReleaseDB from "../model/release/APIQueries";
import { ReleaseCollectionItem } from "./../model/release/ReleaseCollectionItem";
import { logger } from "../config/loggerConf";

const router = express.Router();

async function create(req: Request, res: Response, next: NextFunction) {
  logger.debug(req.body);
  try {
    // TODO: extract `coverPath` ,save it on HDD > construct a url > assign to `coverPath`

    const { coverPath, artist, title, year, label, catNo } = req.body;
    const metadata = { coverPath, artist, title, year, label, catNo };

    const newRelease = await releaseAPIQueriesForReleaseDB.create(metadata);
    res.set("Location", `/releases/${newRelease.getId()}`);
    res.status(201);
    res.json({ results: newRelease.JSON });
  } catch (err) {
    next(err);
  }
}

async function read(req: Request, res: Response, next: NextFunction) {
  try {
    const releaseId = parseInt(req.params.id);
    if (!releaseId) throw new HttpError(422);
    const release = await releaseAPIQueriesForReleaseDB.read(releaseId);
    if (release) res.json(release.JSON);
    else throw new HttpError(404);
  } catch (err) {
    next(err);
  }
}

async function readAll(req: Request, res: Response, next: NextFunction) {
  try {
    const releases = await releaseAPIQueriesForReleaseDB.readAll({
      ...res.locals.sort,
      pagination: res.locals.pagination,
    });
    const releasesJSON = (releases.results as any).map(
      (release: ReleaseCollectionItem) => release.JSON,
    );

    const nextPageLink = `</releases?page=${releases.next_page}&per_page=${res.locals.pagination.itemsPerPage}>; rel='next'`;
    const prevPageLink = `</releases?page=${releases.previous_page}&per_page=${res.locals.pagination.itemsPerPage}>; rel='previous'`;
    const lastPageLink = `</releases?page=${releases.last_page}&per_page=${res.locals.pagination.itemsPerPage}>; rel='last'`;
    const firstPageLink = `</releases?page=${releases.first_page}&per_page=${res.locals.pagination.itemsPerPage}>; rel='first'`;

    res.set(
      "Link",
      `${nextPageLink}, ${prevPageLink}, ${firstPageLink}, ${lastPageLink}`,
    );
    res.set("X-Total-Count", `${releases.total_count}`);
    res.json({
      page_number: releases.page_number,
      total_page: releases.total_pages,
      total_count: releases.total_count,
      previous_page: releases.previous_page
        ? `/releases?page=${releases.previous_page}`
        : null,
      next_page: releases.next_page
        ? `/releases?page=${releases.next_page}`
        : null,
      first_page: releases.first_page
        ? `/releases?page=${releases.first_page}`
        : null,
      last_page: releases.last_page
        ? `/releases?page=${releases.last_page}`
        : null,
      results: releasesJSON,
    });
  } catch (err) {
    next(err);
  }
}

async function updateRelease(req: Request, res: Response, next: NextFunction) {
  try {
    const releaseId = parseInt(req.params.id);
    if (
      isNaN(releaseId) ||
      !req.body.hasOwnProperty("tracks") ||
      !Array.isArray(req.body.tracks) ||
      req.body.tracks.length === 0
    ) {
      throw new HttpError(422);
    }
    //

    //const sanitizedMetadata = await getSanitizedMetadata(
    //  metadata,
    //);
    const releaseMetadata = {
      releaseId: releaseId,

      coverPath: req.body.coverPath,
      artist: req.body.releaseArtist,
      year: req.body.year,
      title: req.body.releaseTitle,
      label: req.body.label,
      catNo: req.body.catNo,
    };

    let newTrack = await releaseAPIQueriesForReleaseDB.update(releaseMetadata);

    res.set("Location", `/releases/${1}`); // FIX: replace 1 with `newTrack.getReleaseId()`
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const releaseId = parseInt(req.params.id);
    if (isNaN(releaseId) || releaseId < 0) throw new HttpError(422);

    const deletedReleaseId = await releaseAPIQueriesForReleaseDB.destroy(
      releaseId,
    );
    if (deletedReleaseId) res.status(204).end();
    else throw new HttpError(404);
  } catch (err) {
    next(err);
  }
}

async function readReleaseTracks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const releaseId = parseInt(req.params.id);
    if (!releaseId) throw new HttpError(422);
    const { tracks } = await releaseAPIQueriesForReleaseDB.readByReleaseId(
      releaseId,
    );
    const tracksJSON = tracks.map((track) => track.JSON);
    res.json({ results: tracksJSON });
  } catch (err) {
    next(err);
  }
}

router.post("/", create);
router.get("/", readAll);
router.get("/:id", read);
router.put("/:id", updateRelease);
router.delete("/:id", destroy);

router.get("/:id/tracks", readReleaseTracks);

export { router };
