import http from "http";
import { AddressInfo } from "net";
import fs from "fs-extra";
import path from "path";
import util from "util";

import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morganLogger from "morgan";
import * as mm from "music-metadata";
//TODO: import cookieParser from "cookie-parser";
//TODO: const session = require("express-session"); // run npm install !!!
//TODO: import chokidar from "chokidar";

import { logger, stream } from "./config/loggerConf";
import * as dbConnection from "./model/postgres";
import * as db from "./model/track/queries";
import { router as tracksRouter } from "./controller/tracks";
import { router as artistsRouter } from "./controller/artists";
import { router as yearsRouter } from "./controller/years";
import { router as genresRouter } from "./controller/genres";
import { router as labelsRouter } from "./controller/labels";
import { router as statisticsRouter } from "./controller/statistics";
import { router as isPicturePathExists } from "./controller/constraints";
import { router as isFilePathExists } from "./controller/constraints";
import { Sanitizer } from "./utility/Sanitizer";
import { readConf, updateConf } from "./config/appConf";
import { getExtensionName } from "./utility/getExtensionName";
import {
  onUncaughtException,
  onUnhandledRejection,
  onServerError,
  expressCustomErrorHandler,
  on404error,
} from "./error-handlers";

import { TrackMetadata, TrackPicture, ExtendedIAudioMetadata } from "./types";

const API_SERVER_PORT = Number(process.env.API_SERVER_PORT);
const MUSIC_LIB_DIR = process.env.MUSIC_LIB_DIR!;
const CONF_PATH = process.env.CONF_PATH!;
const IMG_DIR = process.env.IMG_DIR!;
const SUPPORTED_CODEC = process.env
  .SUPPORTED_CODEC!.split(",")
  .map((str) => str.toLowerCase());
const DEFAULT_COVER_PATH = process.env.DEFAULT_COVER_PATH!;

// TODO:
// save isLibLoaded in browser cookie

process.on("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);

//

const app: Express = express();
const server = http.createServer(app);

app.use(cors());
app.set("port", API_SERVER_PORT);
server.listen(API_SERVER_PORT);

server.on("error", onServerError);
server.on("listening", onServerListening);

// Redirect Morgan logging to Winston log files
app.use(morganLogger("combined", { immediate: true, stream }));

// app.use(session({}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser); -- it hangs the server!
//app.use(express.static(path.join(__dirname, "public")));

app.use("/tracks", tracksRouter);
app.use("/artists", artistsRouter);
app.use("/years", yearsRouter);
app.use("/genres", genresRouter);
app.use("/labels", labelsRouter);
app.use("/statistics", statisticsRouter);
app.use("/constraints", isPicturePathExists);
app.use("/constraints", isFilePathExists);

//
// Express middleware stack
//

app.use(on404error); // Catch 404 errors in router above

app.use(expressCustomErrorHandler);

async function startApp(confPath = CONF_PATH) {
  if (!(await fs.pathExists(confPath))) {
    throw new Error(`Config path doesn't exist`);
  }
  const conf = await readConf(confPath);

  if (!conf.isLibLoaded) {
    logger.debug(`${__filename}: Populating db: it may take a few minutes...`);
    await populateDB(MUSIC_LIB_DIR);
    await updateConf(CONF_PATH, conf, "isLibLoaded", true);
    logger.debug(`${__filename}: Populating db: done`);
  } else {
    logger.debug(`${__filename}: Music library already loaded.`);
  }
}

async function getTrackPicture(
  metadata: mm.IAudioMetadata,
  trackPath: string,
): Promise<TrackPicture | null> {
  if (
    typeof metadata.common.picture === "object" &&
    metadata.common.picture !== null
  ) {
    const { format, data } = metadata.common.picture[0];
    const fileName = path.parse(trackPath).name;
    const extName = format.split("/")[1];
    const picturePath = `${IMG_DIR}/${fileName}.${extName}`;
    return { picturePath, data };
  } else {
    logger.debug(`${__filename}: File ${trackPath} has no cover.`);
    return null;
  }
}

async function writeTrackPictureToFile({ picturePath, data }: TrackPicture) {
  await fs.writeFile(picturePath, data);
}

export async function getSanitizedMetadataFromUser(
  metadata: TrackMetadata,
): Promise<TrackMetadata> {
  const sanitizedMetadata: TrackMetadata = {
    filePath: metadata.filePath,
    extension:
      new Sanitizer<string>(metadata.extension).normalizeExtension().value ||
      "Unknown",
    artist: metadata.artist.length > 0 ? metadata.artist : ["Unknown"],
    duration: metadata.duration || null,
    bitrate: metadata.bitrate || null,
    year: metadata.year || 0,
    trackNo: metadata.trackNo || null,
    title: new Sanitizer<string>(metadata.title).trim().value,
    album: new Sanitizer<string>(metadata.album).trim().value || "Unknown",
    diskNo: metadata.diskNo || null,
    label: new Sanitizer<string>(metadata.label).trim().value || "Unknown",
    genre: metadata.genre.length > 0 ? metadata.genre : ["Unknown"],
    picturePath: metadata.picturePath || DEFAULT_COVER_PATH,
  };

  return sanitizedMetadata;
}

export async function getSanitizedMetadataFromMM(
  metadata: ExtendedIAudioMetadata,
): Promise<TrackMetadata> {
  return {
    filePath: metadata.filePath,
    extension:
      new Sanitizer<string>(metadata.format.codec).normalizeExtension().value ||
      "Unknown",
    artist: metadata.common.artists || ["Unknown"],
    duration: metadata.format.duration || null,
    bitrate: metadata.format.bitrate || null,
    year: metadata.common.year || 0,
    trackNo: metadata.common.track.no || null,
    title: new Sanitizer<string>(metadata.common.title).trim().value,
    album:
      new Sanitizer<string>(metadata.common.album).trim().value || "Unknown",
    diskNo: metadata.common.disk.no || null,
    label:
      new Sanitizer<string>(metadata.common.copyright).trim().value ||
      "Unknown",
    genre: metadata.common.genre || ["Unknown"],
    picturePath: metadata.picturePath || DEFAULT_COVER_PATH,
  };
}

async function parseAudioFile(nodePath: string) {
  const mmMetadata = await mm.parseFile(nodePath);
  const trackPicture = await getTrackPicture(mmMetadata, nodePath);
  if (trackPicture) await writeTrackPictureToFile(trackPicture);
  // TODO: optimize/minimize file size of the picture to 200x200
  const extendedMetadata: ExtendedIAudioMetadata = {
    ...mmMetadata,
    filePath: nodePath,
    picturePath: trackPicture ? trackPicture.picturePath : null,
  };

  return extendedMetadata;
}

async function populateDB(dirPath = MUSIC_LIB_DIR) {
  const fsNodes = await fs.readdir(dirPath);

  for (const node of fsNodes) {
    const nodePath = path.join(dirPath, node);

    if ((await fs.stat(nodePath)).isDirectory()) {
      await populateDB(nodePath);
    } else if (SUPPORTED_CODEC.includes(getExtensionName(nodePath))) {
      const metadata = await parseAudioFile(nodePath);
      await db.create(await getSanitizedMetadataFromMM(metadata));
    }
  }
}
/*
//
// File Watcher
//

//const watcher = chokidar.watch(MUSIC_LIB_DIR, {
//  recursive: true,
//  usePolling: true,
//  alwaysStat: true,
//  persistent: true,
//});

//async function onAddHandler(nodePath) {
//  logger.info(`watcher: ${nodePath}`);
//  if (isSupportedCodec(getExtensionName(nodePath))) {
//    const metadata = await collectMetadata(nodePath);
//    const sanitized = getSanitizedMetadata(metadata);
//    await db.create(sanitized);
//  }
//  logger.info(`File "${nodePath}" has been added`);
//}

//function onChangeHandler(path) {
//db.update(path);
//  logger.info("File", path, "has been changed");
//}

//function onUnlinkHandler(path) {
//  db.destroy(path); // you should pass `id` instead of path
//  logger.info("File", path, "has been removed");
//}

function onServerErrorHandler(err: Error): void {
  logger.error("Error happened", err);
}
*/
function onServerListening() {
  const { port } = server.address() as AddressInfo;
  logger.info(`Listening on port ${port}`);
}

startApp(CONF_PATH)
  .then(() => {
    // return db.read(2);
  })
  .catch((err) => {
    logger.error(`${__filename}: ${util.inspect(err)}`);
    dbConnection.close();
    process.exit(1);
  });
