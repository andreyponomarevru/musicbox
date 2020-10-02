const logger = require("./../utility/loggerConf.js");
const express = require("express");
const router = express.Router();
const track = require("./../model/track/postgres.js");
const util = require("util");

router.get("/", async (req, res, next) => {
  try {
    const tracks = await track.readArtists();
    //logger.debug(`routes/index.js: ${util.inspect(tracks)}`);
    res.send(JSON.stringify(tracks));
  } catch (err) {
    next(err);
  }
});

module.exports.router = router;
