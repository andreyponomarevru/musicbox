import express, { Request, Response, NextFunction } from "express";
import util from "util";

import { logger } from "../config/loggerConf";
import * as artist from "../model/artist/queries";

const router = express.Router();

async function handleRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const artists = await artist.readAll();
    logger.debug(`${__dirname}/${__filename}: ${util.inspect(artists)}`);
    res.send(JSON.stringify(artists));
  } catch (err) {
    next(err);
  }
}

router.get("/", handleRoute);

export { router };
