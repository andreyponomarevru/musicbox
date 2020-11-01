import express, { Request, Response, NextFunction } from "express";
import util from "util";

import { logger } from "../config/loggerConf";
import * as year from "../model/year/queries";

const router = express.Router();

async function handleRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const years = await year.readAll();
    logger.debug(`${__dirname}/${__filename}: ${util.inspect(years)}`);
    res.send(JSON.stringify(years));
  } catch (err) {
    next(err);
  }
}

router.get("/", handleRoute);

export { router };
