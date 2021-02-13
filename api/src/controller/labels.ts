import express, { Request, Response, NextFunction } from "express";
import util from "util";

import { logger } from "../config/loggerConf";
import * as label from "../model/public/label/queries";

const router = express.Router();

async function getLabels(req: Request, res: Response, next: NextFunction) {
  try {
    const labels = await label.readAll();
    logger.debug(`${__filename}: ${util.inspect(labels)}`);
    res.json({ results: labels });
  } catch (err) {
    next(err);
  }
}

router.get("/", getLabels);

export { router };
