import express, { Request, Response, NextFunction } from "express";
import util from "util";

import { logger } from "../config/loggerConf";
import * as label from "../model/label/queries.js";

const router = express.Router();

async function handleRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const labels = await label.readAll();
    logger.debug(`${__dirname}/${__filename}: ${util.inspect(labels)}`);
    res.send(JSON.stringify(labels));
  } catch (err) {
    next(err);
  }
}

router.get("/", handleRoute);

export { router };
