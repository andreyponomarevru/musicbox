import express, { Request, Response, NextFunction } from "express";

import util from "util";

import { logger } from "../config/loggerConf";
import * as year from "../model/year/queries";

const router = express.Router();

async function getYears(req: Request, res: Response, next: NextFunction) {
  try {
    const years = await year.readAll();
    logger.debug(`${__filename}: ${util.inspect(years)}`);
    res.json(years);
  } catch (err) {
    next(err);
  }
}

router.get("/", getYears);

export { router };
