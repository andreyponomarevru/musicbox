import express, { Request, Response, NextFunction } from "express";

import util from "util";

import { logger } from "../config/logger";
import * as year from "../models/public/year/queries";

const router = express.Router();

async function getYears(req: Request, res: Response, next: NextFunction) {
  try {
    const years = await year.readAll();
    logger.debug(`${__filename}: ${util.inspect(years)}`);
    res.json({ results: years });
  } catch (err) {
    next(err);
  }
}

router.get("/", getYears);

export { router };
