import express, { Request, Response, NextFunction } from "express";

import * as constraints from "../model/constraints/queries";

const router = express.Router();

async function isPicturePathExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const coverPath = req.body;
    const coverPathExists = await constraints.coverPathExists(coverPath.path);
    res.json(coverPathExists);
  } catch (err) {
    next(err);
  }
}

router.post("/cover-path", isPicturePathExists);

async function isFilePathExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const filePath = req.body;
    const filePathExists = await constraints.filePathExists(filePath.path);
    res.json(filePathExists);
  } catch (err) {
    next(err);
  }
}

router.post("/file-path", isFilePathExists);

export { router };
