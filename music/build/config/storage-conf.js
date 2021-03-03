"use strict";
/*
 * Multer storage (for file uploading)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const constants_1 = require("../utility/constants");
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, constants_1.IMG_LOCAL_DIR);
    },
    filename(req, file, cb) {
        const newFilename = `${uuid_1.v4()}${path_1.default.extname(file.originalname)}`;
        cb(null, newFilename);
    },
});
const upload = multer_1.default({ storage });
exports.uploadFiles = upload.fields([
    { name: "releaseCover", maxCount: 1 },
    { name: "metadata", maxCount: 1 },
]);
//# sourceMappingURL=storage-conf.js.map