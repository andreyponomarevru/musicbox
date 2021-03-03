"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const HttpError_1 = require("./middlewares/http-errors/HttpError");
const apiQueriesForTrackDB = __importStar(require("../model/public/track/queries"));
const request_parsers_1 = require("./middlewares/request-parsers");
const send_paginated_1 = require("./middlewares/send-paginated");
const router = express_1.default.Router();
exports.router = router;
function read(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trackId = Number(req.params.id);
            const track = yield apiQueriesForTrackDB.read(trackId);
            if (track) {
                res.json(track.JSON);
            }
            else {
                throw new HttpError_1.HttpError(404);
            }
        }
        catch (err) {
            next(err);
        }
    });
}
function readAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const params = Object.assign(Object.assign({}, res.locals.sortParams), res.locals.paginationParams);
            res.locals.linkName = "tracks";
            res.locals.collection = yield apiQueriesForTrackDB.readAll(params);
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const metadata = req.body;
            const newTrack = yield apiQueriesForTrackDB.create(metadata);
            res.set("Location", `/tracks/${newTrack.getTrackId()}`);
            res.status(201);
            res.json({ results: newTrack.JSON });
        }
        catch (err) {
            next(err);
        }
    });
}
function update(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const metadata = Object.assign({ trackId: Number(req.params.id) }, req.body);
            const updatedTrack = yield apiQueriesForTrackDB.update(metadata);
            res.set("location", `/tracks/${updatedTrack.getTrackId()}`);
            res.status(200);
            res.json(updatedTrack.JSON);
        }
        catch (err) {
            next(err);
        }
    });
}
function destroy(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trackId = Number(req.params.id);
            const deletedTrackId = yield apiQueriesForTrackDB.destroy(trackId);
            if (deletedTrackId) {
                res.status(204).end();
            }
            else {
                throw new HttpError_1.HttpError(404);
            }
        }
        catch (err) {
            next(err);
        }
    });
}
router.post("/", create);
router.get("/", request_parsers_1.parseSortParams, request_parsers_1.parsePaginationParams, readAll, send_paginated_1.sendPaginated);
router.get("/:id", read);
router.put("/:id", update);
router.delete("/:id", destroy);
//# sourceMappingURL=tracks.js.map