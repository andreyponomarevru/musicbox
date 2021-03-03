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
exports.router = exports.destroy = void 0;
const express_1 = __importDefault(require("express"));
const storage_conf_1 = require("../config/storage-conf");
const HttpError_1 = require("./middlewares/http-errors/HttpError");
const apiQueriesForReleaseDB = __importStar(require("../model/public/release/queries"));
const request_parsers_1 = require("./middlewares/request-parsers");
const send_paginated_1 = require("./middlewares/send-paginated");
const helpers_1 = require("./../utility/helpers");
const router = express_1.default.Router();
exports.router = router;
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Express always parses json in req.body, but here the
            // request is handled by Multer middleware - it doesn't parse req.body
            // hence we need to do it manually
            const metadata = JSON.parse(req.body.metadata);
            const cover = req.files.releaseCover[0];
            const apiCoverPath = helpers_1.buildApiCoverPath(cover.filename);
            const fullMetadata = Object.assign(Object.assign({}, metadata), { coverPath: apiCoverPath });
            const releaseCatNo = yield apiQueriesForReleaseDB.find(fullMetadata.catNo);
            if (releaseCatNo.length > 0) {
                const errMsg = `Release with 'catNo: ${fullMetadata.catNo}' already exists`;
                throw new HttpError_1.HttpError(409, errMsg);
            }
            else {
                const newRelease = yield apiQueriesForReleaseDB.create(fullMetadata);
                res.set("Location", `/releases/${newRelease.getId()}`);
                res.status(201);
                res.json({ results: newRelease.JSON });
            }
        }
        catch (err) {
            next(err);
        }
    });
}
function read(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const release = yield apiQueriesForReleaseDB.read(id);
            if (release) {
                res.json(release.JSON);
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
            res.locals.linkName = "releases";
            res.locals.collection = yield apiQueriesForReleaseDB.readAll(params);
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function updateRelease(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Express always parses json in req.body, but here the
            // request is handled by Multer middleware - it doesn't parse req.body
            // hence we need to do it manually
            const id = Number(req.params.id);
            const metadata = JSON.parse(req.body.metadata);
            const cover = req.files.releaseCover[0];
            const apiCoverPath = helpers_1.buildApiCoverPath(cover.filename);
            const fullMetadata = Object.assign(Object.assign({ id }, metadata), { coverPath: apiCoverPath });
            const releaseCatNo = yield apiQueriesForReleaseDB.find(fullMetadata.catNo);
            if (releaseCatNo.length > 0) {
                const errMsg = `Release with 'catNo: ${fullMetadata.catNo}' already exists`;
                throw new HttpError_1.HttpError(409, errMsg);
            }
            else {
                let updatedRelease = yield apiQueriesForReleaseDB.update(fullMetadata);
                res.set("Location", `/releases/${updatedRelease.getId()}`);
                res.status(204).end();
            }
        }
        catch (err) {
            next(err);
        }
    });
}
function destroy(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const deletedReleaseId = yield apiQueriesForReleaseDB.destroy(id);
            if (deletedReleaseId) {
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
exports.destroy = destroy;
function readReleaseTracks(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            const { tracks } = yield apiQueriesForReleaseDB.readByReleaseId(id);
            if (tracks) {
                const tracksJSON = tracks.map((track) => track.JSON);
                res.json({ results: tracksJSON });
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
router.post("/", storage_conf_1.uploadFiles, create);
router.get("/", request_parsers_1.parseSortParams, request_parsers_1.parsePaginationParams, readAll, send_paginated_1.sendPaginated);
router.get("/:id", read);
router.put("/:id", storage_conf_1.uploadFiles, updateRelease);
router.delete("/:id", destroy);
router.get("/:id/tracks", readReleaseTracks);
//# sourceMappingURL=releases.js.map