const logger = require("./loggerConf.js");
const fs = require("fs-extra");
const { CONF_PATH } = process.env;
const util = require("util");

async function createConf(confPath = CONF_PATH, confObj) {
  const data = JSON.stringify(confObj, null, 2);
  await fs.writeFile(confPath, data, { encoding: "utf8" });
  logger.info(`${__filename}: conf file created with content:
  \n${util.inspect(confObj)}`);
}

async function getConf(confPath = CONF_PATH) {
  const config = await fs.readFile(confPath, { encoding: "utf8" });
  const parsed = JSON.parse(config);
  logger.info(`${__filename}: conf file read. Content:
  \n${util.inspect(parsed)}`);
  return parsed;
}

async function updateConf(confObj, prop, value) {
  confObj[prop] = value;
  const updatedConf = JSON.stringify(confObj, null, 2);
  await fs.writeFile(CONF_PATH, updatedConf);
  logger.info(`${__filename}: conf file updated. Content:
  \n${util.inspect(updatedConf)}`);
}

module.exports.createConf = createConf;
module.exports.getConf = getConf;
module.exports.updateConf = updateConf;
