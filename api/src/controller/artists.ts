import express, { Request, Response, NextFunction } from "express";
import util from "util";

import { logger } from "../config/loggerConf";
import * as artist from "../model/artist/queries";

const router = express.Router();

async function handleRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const artists = await artist.readAll();
    logger.debug(`${__filename}: ${util.inspect(artists)}`);
    res.json(artists);
  } catch (err) {
    next(err);
  }
}

router.get("/", handleRoute);

export { router };
