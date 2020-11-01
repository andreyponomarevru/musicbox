import http from "http";
import { AddressInfo } from "net";
import fs from "fs-extra";
import path from "path";
import util from "util";

import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morganLogger from "morgan";
import * as mm from "music-metadata";

import { logger, stream } from "./config/loggerConf";
import * as dbConnection from "./model/postgres";
import * as db from "./model/track/queries";
/*
//TODO: import chokidar from "chokidar";
//TODO: import cookieParser from "cookie-parser";
import { router as tracksRouter } from "./routes/tracks";
import { router as artistsRouter } from "./routes/artists";
import { router as yearsRouter } from "./routes/years";
import { router as genresRouter } from "./routes/genres";
import { router as labelsRouter } from "./routes/labels";
import { router as albumRouter } from "./routes/albums";
//TODO: const session = require("express-session"); // run npm install !!!
*/
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

import { RawMetadata, TrackMetadata } from "./types";
import { Cipher } from "crypto";

const API_SERVER_PORT = Number(process.env.API_SERVER_PORT);
const MUSIC_LIB_PATH = process.env.MUSIC_LIB_PATH!;
const CONF_PATH = process.env.CONF_PATH!;
const SUPPORTED_CODEC = process.env
  .SUPPORTED_CODEC!.split(",")
  .map((str) => str.toLowerCase());

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
/*
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser); -- it hangs the server!
//app.use(express.static(path.join(__dirname, "public")));

app.use("/tracks", tracksRouter);
app.use("/artists", artistsRouter);
app.use("/years", yearsRouter);
app.use("/genres", genresRouter);
app.use("/labels", labelsRouter);
app.use("/albums", albumRouter);
*/

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
    await populateDB(MUSIC_LIB_PATH);
    await updateConf(CONF_PATH, conf, "isLibLoaded", true);
    logger.debug(`${__filename}: Populating db: done`);
  } else {
    logger.debug(`${__filename}: Music library already loaded.`);
  }
}

async function collectMetadata(filePath: string) {
  const mmData = await mm.parseFile(filePath);
  const metadata = { ...mmData, filePath };
  return metadata;
}

async function getSanitizedMetadata(metadata: RawMetadata) {
  console.log(metadata.common.artists);
  return {
    filePath: new Sanitizer<string>(metadata.filePath).trim().value,
    extension:
      new Sanitizer<string>(metadata.format.codec).normalizeExtension().value ||
      null,
    artist: metadata.common.artists || [],
    duration: metadata.format.duration || null,
    bitrate: metadata.format.bitrate || null,
    year: metadata.common.year || null,
    trackNo: metadata.common.track.no || null,
    title: new Sanitizer<string>(metadata.common.title).trim().value,
    album: new Sanitizer<string>(metadata.common.album).trim().value,
    diskNo: metadata.common.disk.no || null,
    label: new Sanitizer<string>(metadata.common.copyright).trim().value,
    genre: metadata.common.genre || [],
  };
}

async function populateDB(dirPath = MUSIC_LIB_PATH) {
  const fsNodes = await fs.readdir(dirPath);

  for (const node of fsNodes) {
    const nodePath = path.join(dirPath, node);
    console.log(`${nodePath}: ---`);
    console.log(SUPPORTED_CODEC, "---", getExtensionName(nodePath));

    if ((await fs.stat(nodePath)).isDirectory()) {
      await populateDB(nodePath);
    } else if (SUPPORTED_CODEC.includes(getExtensionName(nodePath))) {
      const metadata = await collectMetadata(nodePath);
      const sanitized = await getSanitizedMetadata(metadata);
      //logger.debug(sanitized);
      await db.create(sanitized);
    }
  }
}
/*
//
// File Watcher
//

//const watcher = chokidar.watch(MUSIC_LIB_PATH, {
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
