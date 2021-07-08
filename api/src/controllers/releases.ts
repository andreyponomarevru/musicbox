import express, { Request, Response, NextFunction } from "express";
import { uploadFiles } from "../config/file-upload-storage";

import { HttpError } from "./middlewares/http-errors/HttpError";
import * as apiQueriesForReleaseDB from "../models/public/release/queries";
import { parsePaginationParams } from "./middlewares/parse-pagination-params";
import { parseSortParams } from "./middlewares/parse-sort-params";
import { sendPaginated } from "./middlewares/send-paginated";
import { buildImageURL } from "../utility";
import { UploadFiles, ParsedTrack } from "../types";
import { schemaId } from "../models/validation-schemas";

const router = express.Router();

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    // Express always parses json in req.body, but here the
    // request is handled by Multer middleware - it doesn't parse req.body
    // hence we need to do it manually
    const metadata = JSON.parse(req.body.metadata);
    const cover = (req.files as UploadFiles).releaseCover![0];
    const apiCoverPath = buildImageURL(cover.filename);
    const fullMetadata: ParsedTrack = {
      ...metadata,
      coverPath: apiCoverPath,
    };

    const isCatNoExist = await apiQueriesForReleaseDB.find(fullMetadata.catNo);
    if (isCatNoExist) {
      const errMsg = `Release with 'catNo: ${fullMetadata.catNo}' already exists`;
      throw new HttpError(409, errMsg);
    } else {
      const newRelease = await apiQueriesForReleaseDB.create(fullMetadata);
      res.set("Location", `/releases/${newRelease.id}`);
      res.status(201);
      res.json({ results: newRelease.JSON });
    }
  } catch (err) {
    next(err);
  }
}

async function read(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const validId: number = await schemaId.validateAsync(id);
    const release = await apiQueriesForReleaseDB.read(validId);

    if (release) {
      res.json({ results: release.JSON });
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
      sort: res.locals.sortParams,
      pagination: res.locals.paginationParams,
    });
    res.locals.linkName = "releases";

    next();
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
    const releaseId = Number(req.params.id);
    const validReleaseId: number = await schemaId.validateAsync(releaseId);
    const { tracks } = await apiQueriesForReleaseDB.readByReleaseId(
      validReleaseId,
    );

    if (tracks) {
      const tracksJSON = tracks.map((track) => track.JSON);
      res.json({ results: tracksJSON });
    } else {
      throw new HttpError(404);
    }
  } catch (err) {
    next(err);
  }
}

async function updateRelease(req: Request, res: Response, next: NextFunction) {
  try {
    // Express always parses json in req.body, but here the
    // request is handled by Multer middleware - it doesn't parse req.body
    // hence we need to do it manually
    const id = Number(req.params.id);
    const metadata = JSON.parse(req.body.metadata);
    const cover = (req.files as UploadFiles).releaseCover![0];
    const apiCoverPath = buildImageURL(cover.filename);
    const fullMetadata = { id, ...metadata, coverPath: apiCoverPath };

    const isCatNoExist = await apiQueriesForReleaseDB.find(fullMetadata.catNo);
    if (isCatNoExist) {
      const errMsg = `Release with 'catNo: ${fullMetadata.catNo}' already exists`;
      throw new HttpError(409, errMsg);
    } else {
      const updatedRelease = await apiQueriesForReleaseDB.update(fullMetadata);
      res.set("Location", `/releases/${updatedRelease.id}`);
      res.status(204).end();
    }
  } catch (err) {
    next(err);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const releaseId = Number(req.params.id);
    const validReleaseId = await schemaId.validateAsync(releaseId);
    const deletedReleaseId = await apiQueriesForReleaseDB.destroy(
      validReleaseId,
    );

    if (deletedReleaseId) {
      res.status(204).end();
    } else {
      throw new HttpError(404);
    }
  } catch (err) {
    next(err);
  }
}

router.post("/", uploadFiles, create);
router.get("/", parseSortParams, parsePaginationParams, readAll, sendPaginated);
router.get("/:id", read);
router.get("/:id/tracks", readReleaseTracks);
router.put("/:id", uploadFiles, updateRelease);
router.delete("/:id", destroy);

export { router };
