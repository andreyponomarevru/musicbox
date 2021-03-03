"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const logger = require("./../utility/loggerConf.js");
const express = require("express");
const router = express.Router();
const track = require("./../model/track/postgres.js");
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tracks = yield track.readAll();
        //console.log(track);
        logger.debug(`Track from DB: ${tracks}`);
        res.render("setup", {
            title: "Musicbox Setup",
            tracks,
        });
    }
    catch (err) {
        next(err);
    }
}));
module.exports.router = router;
//# sourceMappingURL=setup.js.map