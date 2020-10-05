const logger = require("./../utility/loggerConf.js");
const express = require("express");
const router = express.Router();
const genre = require("../model/genre/queries.js");
const util = require("util");

router.get("/", async (req, res, next) => {
  try {
    const genres = await genre.readAll();
    logger.debug(`${__dirname}/${__filename}: ${util.inspect(genres)}`);
    res.send(JSON.stringify(genres));
  } catch (err) {
    next(err);
  }
});

module.exports.router = router;
