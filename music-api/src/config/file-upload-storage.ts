//
// Multer storage (for file uploading)
//

import path from "path";
import multer from "multer";
import { v4 as uuid } from "uuid";
const IMG_DIR = process.env.IMG_DIR!;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, IMG_DIR);
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
