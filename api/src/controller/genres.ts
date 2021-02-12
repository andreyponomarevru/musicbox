import express, { Request, Response, NextFunction } from "express";
import util from "util";

import { logger } from "../config/loggerConf";
import * as genre from "../model/genre/queries";

const router = express.Router();

async function getGenres(req: Request, res: Response, next: NextFunction) {
  try {
    const genres = await genre.readAll();
    logger.debug(`${__filename}: ${util.inspect(genres)}`);
    res.json({ results: genres });
  } catch (err) {
    next(err);
  }
}

router.get("/", getGenres);

export { router };
