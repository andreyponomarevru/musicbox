import express, { Request, Response, NextFunction } from "express";

import util from "util";

import { logger } from "../config/loggerConf";
import * as stats from "../model/stats/queries";

const router = express.Router();

async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const retrievedStats = await stats.readLibStats();
    logger.debug(`${__filename}: ${util.inspect(retrievedStats)}`);
    res.json(retrievedStats);
  } catch (err) {
    next(err);
  }
}

router.get("/", getStats);

async function getGenreStats(req: Request, res: Response, next: NextFunction) {
  try {
    const genreStats = await stats.readGenreStats();
    logger.debug(`${__filename}: ${util.inspect(genreStats)}`);
    res.json(genreStats);
  } catch (err) {
    next(err);
  }
}

router.get("/genres", getGenreStats);

async function getYearStats(req: Request, res: Response, next: NextFunction) {
  try {
    const yearStats = await stats.readYearStats();
    logger.debug(`${__filename}: ${util.inspect(yearStats)}`);
    res.json(yearStats);
  } catch (err) {
    next(err);
  }
}

router.get("/years", getYearStats);

async function getArtistStats(req: Request, res: Response, next: NextFunction) {
  try {
    const artistStats = await stats.readArtistStats();
    logger.debug(`${__filename}: ${util.inspect(artistStats)}`);
    res.json(artistStats);
  } catch (err) {
    next(err);
  }
}

router.get("/artists", getArtistStats);

async function getLabelStats(req: Request, res: Response, next: NextFunction) {
  try {
    const labelStats = await stats.readLabelStats();
    logger.debug(`${__filename}: ${util.inspect(labelStats)}`);
    res.json(labelStats);
  } catch (err) {
    next(err);
  }
}

router.get("/labels", getLabelStats);

export { router };
