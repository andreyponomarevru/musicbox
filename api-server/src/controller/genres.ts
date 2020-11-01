import express, { Request, Response, NextFunction } from "express";
import util from "util";

import { logger } from "../config/loggerConf";
import * as genre from "../model/genre/queries";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const genres = await genre.readAll();
    logger.debug(`${__dirname}/${__filename}: ${util.inspect(genres)}`);
    res.send(JSON.stringify(genres));
  } catch (err) {
    next(err);
  }
});

export { router };
