import util from "util";

import express, { Request, Response, NextFunction } from "express";

import { HttpError } from "./../utility/http-errors/HttpError";
import * as releaseDB from "../model/release/queries";
import * as trackDB from "../model/track/queries";
import {
  parseRequestSortParams,
  parseRequestInt,
} from "../utility/requestParsers";
import { ReadAllByPages, ReleaseMetadata } from "./../types";
import { Release } from "./../model/release/Release";
import { logger } from "../config/loggerConf";
import { SORT_COLUMNS, PER_PAGE_NUMS, SORT_ORDER } from "../utility/constants";

const DEFAULT_COVER_URL = process.env.DEFAULT_COVER_URL!;

const router = express.Router();

async function create(req: Request, res: Response, next: NextFunction) {
  logger.debug(req.body);
  try {
    if (
      !req.body.hasOwnProperty("tracks") ||
      !Array.isArray(req.body.tracks) ||
      req.body.tracks.length === 0
    ) {
      throw new HttpError(422);
    }

    const releaseMetadata = {
      coverPath: req.body.coverPath || DEFAULT_COVER_URL,
      releaseArtist: req.body.releaseArtist,
      year: req.body.year,
      releaseTitle: req.body.releaseTitle,
      label: req.body.label,
      catNo: req.body.catNo,
    };

    let newTrack;
    for (const trackMetadata of req.body.tracks) {
      const metadata = { ...releaseMetadata, ...trackMetadata };
      console.log(metadata);
      newTrack = await trackDB.create(metadata);
    }

    const releaseId = newTrack?.getReleaseId() as number;

    const newRelease = new Release({
      coverPath: releaseMetadata.coverPath,
      artist: releaseMetadata.releaseArtist,
      title: releaseMetadata.releaseTitle,
      label: releaseMetadata.label,
      catNo: releaseMetadata.catNo,
      year: releaseMetadata.year,
      id: releaseId,
    });
    res.set("location", `/releases/${newRelease.getId()}`);
    res.status(201);
    res.json(newRelease.JSON);
  } catch (err) {
    next(err);
  }
}

async function read(req: Request, res: Response, next: NextFunction) {
  try {
    const releaseId = parseInt(req.params.id);
    if (!releaseId) throw new HttpError(422);
    const release = await releaseDB.read(releaseId);
    if (release) res.json(release.JSON);
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
    sortBy,
    sortOrder,
    pagination: {
      page,
      itemsPerPage,
    },
  };

  try {
    const releases = await releaseDB.readAll(reqParams);
    const releasesJSON = releases.results.map((release) => release.JSON);

    const nextPageLink = `</releases?page=${
      releases.total_pages > page ? page + 1 : null
    }&per_page=${itemsPerPage}>; rel='next'`;
    const prevPageLink = `</releases?page=${
      releases.page_number > 1 ? releases.page_number - 1 : null
    }&per_page=${itemsPerPage}>; rel='previous'`;
    const lastPageLink = `</releases?page=${releases.last_page}&per_page=${itemsPerPage}>; rel='last'`;

    res.set("Link", `${nextPageLink}, ${prevPageLink}, ${lastPageLink}`);
    res.set("X-Total-Count", `${releasesJSON.length}`);
    res.json({
      page_number: releases.page_number,
      total_page: releases.total_pages,
      total_count: releases.total_count,
      previous_page: releases.previous_page,
      next_page: releases.next_page,
      last_page: releases.last_page,
      results: releasesJSON,
    });
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
*/

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const releaseId = parseInt(req.params.id);
    if (isNaN(releaseId) || releaseId < 0) throw new HttpError(422);

    const deletedReleaseId = await releaseDB.destroy(releaseId);
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
    const { tracks } = await trackDB.readByReleaseId(releaseId);
    const tracksJSON = tracks.map((track) => track.JSON);
    res.json(tracksJSON);
  } catch (err) {
    next(err);
  }
}

router.post("/", create);
router.get("/:id", read);
router.get("/", readAll);
router.get("/:id/tracks", readReleaseTracks);
//router.put("/:id", updateRelease);
router.delete("/:id", destroy);

export { router };
