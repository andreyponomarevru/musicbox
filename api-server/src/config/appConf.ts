import util from "util";
import fs from "fs-extra";

import { logger } from "./loggerConf";

type Conf = {
  isLibLoaded: boolean;
  [key: string]: unknown;
};
/*
async function createConf(confPath = CONF_PATH, confObj): Promise<void> {
  const data = JSON.stringify(confObj, null, 2);
  await fs.writeFile(confPath, data, { encoding: "utf8" });
  logger.debug(`${__filename}: conf file created with content:
  ${util.inspect(confObj)}`);
}*/

async function readConf(confPath: string): Promise<Conf> {
  const config = await fs.readFile(confPath, { encoding: "utf8" });
  const parsed = JSON.parse(config);
  logger.debug(`${__filename}: conf file read. Content:
  ${util.inspect(parsed)}`);
  return parsed;
}

async function updateConf(
  confPath: string,
  confObj: Conf,
  prop: string,
  value: unknown,
): Promise<void> {
  confObj[prop] = value;
  const updatedConf = JSON.stringify(confObj, null, 2);
  await fs.writeFile(confPath, updatedConf);
  logger.debug(`${__filename}: conf file updated. Content:
  ${util.inspect(updatedConf)}`);
}

export { readConf, updateConf };
