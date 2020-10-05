const logger = require("../utility/loggerConf.js");
const express = require("express");
const router = express.Router();
const track = require("../model/track/queries.js");
const util = require("util");

router.get("/", async (req, res, next) => {
  try {
    const tracks = await track.readAll();
    logger.debug(`${__dirname}/${__filename}: ${util.inspect(tracks)}`);
    res.send(JSON.stringify(tracks));
  } catch (err) {
    next(err);
  }
});

module.exports.router = router;
