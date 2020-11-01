import express, { Request, Response, NextFunction } from "express";
import util from "util";

import { logger } from "../config/loggerConf";
import * as album from "../model/album/queries";

const router = express.Router();

async function handleRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const albums = await album.readAll();
    logger.debug(`${__dirname}/${__filename}: ${util.inspect(albums)}`);
    res.send(JSON.stringify(albums));
  } catch (err) {
    next(err);
  }
}

router.get("/", handleRoute);

export { router };
