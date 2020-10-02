const logger = require("./../utility/loggerConf.js");
const express = require("express");
const router = express.Router();
const track = require("./../model/track/postgres.js");

router.get("/", async (req, res, next) => {
  try {
    const tracks = await track.readAll();
    //console.log(track);
    //logger.debug(`Track from DB: ${tracks}`);
    res.render("setup", {
      title: "Musicbox Setup",
      tracks,
    });
  } catch (err) {
    next(err);
  }
});

module.exports.router = router;
