const logger = require("./../utility/loggerConf.js");
const express = require("express");
const router = express.Router();
const label = require("../model/label/queries.js");
const util = require("util");

router.get("/", async (req, res, next) => {
  try {
    const labels = await label.readAll();
    logger.debug(`${__dirname}/${__filename}: ${util.inspect(labels)}`);
    res.send(JSON.stringify(labels));
  } catch (err) {
    next(err);
  }
});

module.exports.router = router;
