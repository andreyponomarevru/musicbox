import express, { Request, Response, NextFunction } from "express";

import util from "util";

import { logger } from "../config/loggerConf";
import * as stats from "../model/stats/queries";

const router = express.Router();

async function handleRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const retrievedStats = await stats.readLibStats();
    logger.debug(`${__filename}: ${util.inspect(retrievedStats)}`);
    res.json(retrievedStats);
  } catch (err) {
    next(err);
  }
}

router.get("/", handleRoute);

export { router };
