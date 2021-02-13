import util from "util";

import express, { Request, Response, NextFunction } from "express";

import {
  schemaCreateRelease,
  schemaUpdateRelease,
  schemaId,
} from "./../model/public/validation-schemas";
import { HttpError } from "./../utility/http-errors/HttpError";
import * as apiQueriesForReleaseDB from "../model/public/release/queries";
import { logger } from "../config/loggerConf";
import {
  parseSortParams,
  parsePaginationParams,
} from "../utility/middlewares/request-parsers";
import { sendPaginated } from "../utility/middlewares/send-paginated";

const router = express.Router();

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO: extract `coverPath` ,save it on HDD > construct a url > assign to `coverPath`
    const metadata = await schemaCreateRelease.validateAsync(req.body);
    const newRelease = await apiQueriesForReleaseDB.create(metadata);
    res.set("Location", `/releases/${newRelease.getId()}`);
    res.status(201);
    res.json({ results: newRelease.JSON });
  } catch (err) {
    next(err);
  }
}

async function read(req: Request, res: Response, next: NextFunction) {
  try {
    const id: number = await schemaId.validateAsync(req.params.id);
    const release = await apiQueriesForReleaseDB.read(id);
    if (release) {
      res.json(release.JSON);
    } else {
      throw new HttpError(404);
    }
  } catch (err) {
    next(err);
  }
}

async function readAll(req: Request, res: Response, next: NextFunction) {
  try {
    res.locals.collection = await apiQueriesForReleaseDB.readAll({
      ...res.locals.sortParams,
      ...res.locals.paginationParams,
    });
    res.locals.linkName = "releases";

    next();
  } catch (err) {
    next(err);
  }
}

async function updateRelease(req: Request, res: Response, next: NextFunction) {
  try {
    //const sanitizedMetadata = await getSanitizedMetadata(
    //  metadata,
    //);
    const metadata = {
      id: req.params.id,
      ...req.body,
    };
    console.log(metadata);
    const releaseMetadata = await schemaUpdateRelease.validateAsync(metadata);
    let updatedRelease = await apiQueriesForReleaseDB.update(releaseMetadata);
    res.set("Location", `/releases/${updatedRelease.getId()}`);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const id: number = await schemaId.validateAsync(req.params.id);
    const deletedReleaseId = await apiQueriesForReleaseDB.destroy(id);
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
    const id: number = await schemaId.validateAsync(req.params.id);
    const { tracks } = await apiQueriesForReleaseDB.readByReleaseId(id);
    if (tracks.length === 0) throw new HttpError(404);
    const tracksJSON = tracks.map((track) => track.JSON);
    res.json({ results: tracksJSON });
  } catch (err) {
    next(err);
  }
}

router.post("/", create);
router.get("/", parseSortParams, parsePaginationParams, readAll, sendPaginated);
router.get("/:id", read);
router.put("/:id", updateRelease);
router.delete("/:id", destroy);
router.get("/:id/tracks", readReleaseTracks);

export { router };
