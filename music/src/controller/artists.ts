import express, { Request, Response, NextFunction } from "express";
import util from "util";

import { logger } from "../config/logger-conf";
import * as artist from "../model/public/artist/queries";

const router = express.Router();

async function getArtists(req: Request, res: Response, next: NextFunction) {
  try {
    const artists = await artist.readAll();
    logger.debug(`${__filename}: ${util.inspect(artists)}`);
    res.json({ results: artists });
  } catch (err) {
    next(err);
  }
}

router.get("/", getArtists);

export { router };
