const logger = require("./../utility/loggerConf.js");
const express = require("express");
const router = express.Router();
const year = require("../model/year/queries.js");
const util = require("util");

router.get("/", async (req, res, next) => {
  try {
    const years = await year.readAll();
    logger.debug(`${__dirname}/${__filename}: ${util.inspect(years)}`);
    res.send(JSON.stringify(years));
  } catch (err) {
    next(err);
  }
});

module.exports.router = router;
