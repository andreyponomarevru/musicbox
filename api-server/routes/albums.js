const logger = require("./../utility/loggerConf.js");
const express = require("express");
const router = express.Router();
const album = require("../model/album/queries.js");
const util = require("util");

router.get("/", async (req, res, next) => {
  try {
    const albums = await album.readAll();
    logger.debug(`${__dirname}/${__filename}: ${util.inspect(albums)}`);
    res.send(JSON.stringify(albums));
  } catch (err) {
    next(err);
  }
});

module.exports.router = router;
