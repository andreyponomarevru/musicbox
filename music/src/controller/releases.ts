import express, { Request, Response, NextFunction } from "express";
import { uploadFiles } from "../config/storage-conf";

import { HttpError } from "./middlewares/http-errors/HttpError";
import * as apiQueriesForReleaseDB from "../model/public/release/queries";
import {
  parseSortParams,
  parsePaginationParams,
} from "./middlewares/request-parsers";
import { sendPaginated } from "./middlewares/send-paginated";
import { UploadFiles, ReleaseExtendedMeta } from "./../types";
import { buildApiCoverPath } from "./../utility/helpers";

const router = express.Router();

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    // Express always parses json in req.body, but here the
    // request is handled by Multer middleware - it doesn't parse req.body
    // hence we need to do it manually
    const metadata = JSON.parse(req.body.metadata);
    const cover = (req.files as UploadFiles).releaseCover![0];
    const apiCoverPath = buildApiCoverPath(cover.filename);
    const fullMetadata: ReleaseExtendedMeta = {
      ...metadata,
      coverPath: apiCoverPath,
    };

    const releaseCatNo = await apiQueriesForReleaseDB.find(fullMetadata.catNo);
    if (releaseCatNo.length > 0) {
      const errMsg = `Release with 'catNo: ${fullMetadata.catNo}' already exists`;
      throw new HttpError(409, errMsg);
    } else {
      const newRelease = await apiQueriesForReleaseDB.create(fullMetadata);
      res.set("Location", `/releases/${newRelease.getId()}`);
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
    const params = {
      ...res.locals.sortParams,
      ...res.locals.paginationParams,
    };
    res.locals.linkName = "releases";
    res.locals.collection = await apiQueriesForReleaseDB.readAll(params);

    next();
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
    const apiCoverPath = buildApiCoverPath(cover.filename);
    const fullMetadata = { id, ...metadata, coverPath: apiCoverPath };

    const releaseCatNo = await apiQueriesForReleaseDB.find(fullMetadata.catNo);
    if (releaseCatNo.length > 0) {
      const errMsg = `Release with 'catNo: ${fullMetadata.catNo}' already exists`;
      throw new HttpError(409, errMsg);
    } else {
      let updatedRelease = await apiQueriesForReleaseDB.update(fullMetadata);
      res.set("Location", `/releases/${updatedRelease.getId()}`);
      res.status(204).end();
    }
  } catch (err) {
    next(err);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const deletedReleaseId = await apiQueriesForReleaseDB.destroy(id);

    if (deletedReleaseId) {
      res.status(204).end();
    } else {
      throw new HttpError(404);
    }
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
    const id = Number(req.params.id);
    const { tracks } = await apiQueriesForReleaseDB.readByReleaseId(id);

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

router.post("/", uploadFiles, create);
router.get("/", parseSortParams, parsePaginationParams, readAll, sendPaginated);
router.get("/:id", read);
router.put("/:id", uploadFiles, updateRelease);
router.delete("/:id", destroy);
router.get("/:id/tracks", readReleaseTracks);

export { router };
