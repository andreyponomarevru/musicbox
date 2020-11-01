import express, { Request, Response, NextFunction } from "express";
import util from "util";

import { logger } from "../config/loggerConf";
import * as track from "../model/track/queries";

const router = express.Router();

async function handleRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const tracks = await track.readAll();
    logger.debug(`${__dirname}/${__filename}: ${util.inspect(tracks)}`);
    res.send(JSON.stringify(tracks));
  } catch (err) {
    return next(err);
  }
}

router.get("/", handleRoute);

export { router };
