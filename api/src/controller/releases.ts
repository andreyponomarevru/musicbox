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

const DEFAULT_COVER_URL = process.env.DEFAULT_COVER_URL!;

const router = express.Router();

async function createRelease(req: Request, res: Response, next: NextFunction) {
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

async function getRelease(req: Request, res: Response, next: NextFunction) {
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

async function getReleases(req: Request, res: Response, next: NextFunction) {
  const { sortBy, sortOrder } = parseRequestSortParams(req.query.sort);
  const page = parseRequestInt(req.query.page);
  const itemsPerPage = parseRequestInt(req.query.limit);

  const reqParams = {
    sortBy,
    sortOrder,
    pagination: {
      page,
      itemsPerPage,
    },
  };

  try {
    const { releases } = await releaseDB.readAllByPages(reqParams);
    const releasesJSON = releases.map((release) => release.JSON);
    console.log(releasesJSON);
    res.json({
      releases: releasesJSON,
      //page: page,
      //total_pages: total_tracks / itemsPerPage,
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
async function getReleaseTracks(
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

router.post("/", createRelease);
router.get("/:id", getRelease);
router.get("/", getReleases);
router.get("/:id/tracks", getReleaseTracks);
//router.put("/:id", updateRelease);
//router.delete("/:id", destroyRelease);

export { router };
