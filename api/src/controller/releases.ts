import util from "util";

import express, { Request, Response, NextFunction } from "express";

import Joi from "joi";

import {
  schemaCreateRelease,
  schemaUpdateRelease,
  schemaId,
} from "./../model/validation-schemas";
import { validate } from "../utility/middlewares/joi-validation";
import { HttpError } from "./../utility/http-errors/HttpError";
import * as apiQueriesForReleaseDB from "../model/release/APIQueries";
import { ReleaseShort } from "../model/release/ReleaseShort";
import { ReleaseShortMetadata } from "./../types";
import { logger } from "../config/loggerConf";
import {
  parseSortParams,
  parsePaginationParams,
} from "../utility/middlewares/request-parsers";
import { sendPaginated } from "../utility/middlewares/send-paginated";

const router = express.Router();

async function create(req: Request, res: Response, next: NextFunction) {
  logger.debug(req.body);
  try {
    // TODO: extract `coverPath` ,save it on HDD > construct a url > assign to `coverPath`

    const newRelease = await apiQueriesForReleaseDB.create(req.body);
    res.set("Location", `/releases/${newRelease.getId()}`);
    res.status(201);
    res.json({ results: newRelease.JSON });
  } catch (err) {
    next(err);
  }
}

async function read(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = await schemaId.validateAsync({ id: req.params.id });
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

// Update ONLY release itself. If catNo is same, return error
async function updateRelease(req: Request, res: Response, next: NextFunction) {
  try {
    //const sanitizedMetadata = await getSanitizedMetadata(
    //  metadata,
    //);
    const { id } = req.params;
    const { body } = req;

    const releaseMetadata = await schemaUpdateRelease.validateAsync({
      id,
      ...body,
    });

    let newRelease = await apiQueriesForReleaseDB.update(releaseMetadata);

    res.set("Location", `/releases/${1}`); // FIX: replace 1 with `newRelease.getReleaseId()`
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = await schemaId.validateAsync({ id: req.params.id });
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
    const { id } = await schemaId.validateAsync({ id: req.params.id });
    const { tracks } = await apiQueriesForReleaseDB.readByReleaseId(id);
    const tracksJSON = tracks.map((track) => track.JSON);
    res.json({ results: tracksJSON });
  } catch (err) {
    next(err);
  }
}

router.post("/", validate(schemaCreateRelease), create);
router.get("/", parseSortParams, parsePaginationParams, readAll, sendPaginated);
router.get("/:id", read);
router.put("/:id", validate(schemaUpdateRelease), updateRelease);
router.delete("/:id", destroy);
router.get("/:id/tracks", readReleaseTracks);

export { router };
