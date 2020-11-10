import express, { Request, Response, NextFunction } from "express";

import util from "util";

import { logger } from "../config/loggerConf";
import * as statistics from "../model/statistics/queries";

const router = express.Router();

async function handleRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await statistics.readLibStatistic();
    logger.debug(`${__filename}: ${util.inspect(stats)}`);
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

router.get("/", handleRoute);

export { router };
