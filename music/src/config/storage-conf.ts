/*
 * Multer storage (for file uploading)
 */

import path from "path";

import multer from "multer";
import { v4 as uuid } from "uuid";

import { IMG_LOCAL_DIR } from "../utility/constants";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, IMG_LOCAL_DIR);
  },
  filename(req, file, cb) {
    const newFilename = `${uuid()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});
const upload = multer({ storage });

export const uploadFiles = upload.fields([
  { name: "releaseCover", maxCount: 1 },
  { name: "metadata", maxCount: 1 },
]);
