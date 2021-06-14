import http from "http";
import { AddressInfo } from "net";
import fs from "fs-extra";
import path from "path";
import util from "util";

import express, { Express } from "express";
import cors from "cors";
import morganLogger from "morgan";
import cookieParser from "cookie-parser";
//import session from "express-session";

import { logger, stream } from "./config/logger";
import * as dbConnection from "./model/postgres";
import * as trackModel from "./model/local/track/queries";
import * as userModel from "./model/public/user/queries";
import * as userSettingsModel from "./model/public/settings/queries";
import { router as tracksRouter } from "./controller/tracks";
import { router as releasesRouter } from "./controller/releases";
import { router as artistsRouter } from "./controller/artists";
import { router as yearsRouter } from "./controller/years";
import { router as genresRouter } from "./controller/genres";
import { router as labelsRouter } from "./controller/labels";
import { router as statsRouter } from "./controller/stats";
import { router as searchRouter } from "./controller/search";
import { getExtensionName } from "./utility";
import {
  onUncaughtException,
  onUnhandledRejection,
  expressCustomErrorHandler,
  on404error,
} from "./controller/middlewares/error-handlers";
import { TrackMetadataParser } from "./model/track-metadata-parser";

const SUPPORTED_CODEC = (process.env.SUPPORTED_CODEC as string)
  .split(",")
  .map((name) => name.toLowerCase());
const MUSIC_LIB_DIR = process.env.MUSIC_LIB_DIR as string;
const DEFAULT_USERNAME = process.env.DEFAULT_USERNAME as string;
const PORT = Number(process.env.PORT);

//

export function onServerListening(): void {
  const { port } = server.address() as AddressInfo;
  logger.info(`Listening on port ${port}`);
}

export function onServerError(err: NodeJS.ErrnoException): void | never {
  if (err.syscall !== "listen") throw err;

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;

  // Messages for listen errors
  switch (err.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
}

async function populateDB(dirPath = MUSIC_LIB_DIR) {
  const fsNodes = await fs.readdir(dirPath);

  for (const node of fsNodes) {
    const nodePath = path.join(dirPath, node);

    if ((await fs.stat(nodePath)).isDirectory()) {
      await populateDB(nodePath);
    } else if (SUPPORTED_CODEC.includes(getExtensionName(nodePath))) {
      const trackMetadataParser = new TrackMetadataParser(nodePath);
      const metadata = await trackMetadataParser.parseAudioFile();
      await trackModel.create(metadata);
    }
  }
}

async function startApp() {
  if ((await userModel.exists(1)).exists) {
    logger.info(`${__filename}: Music library already loaded.`);
    return;
  }

  const { userId } = await userModel.create(DEFAULT_USERNAME);
  const { settings } = await userSettingsModel.create(userId, {
    isLibLoaded: false,
  });

  logger.info(`${__filename}: Populating db: it may take a few minutes...`);
  await populateDB(MUSIC_LIB_DIR);
  settings.isLibLoaded = true;
  await userSettingsModel.update(userId, settings);
  logger.info(`${__filename}: Populating db: done`);
}

//

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);

const app: Express = express();
const server = http.createServer(app);

app.set("port", PORT);

server.on("error", onServerError);
server.on("listening", onServerListening);

server.listen(PORT);

//
// Middleware stack
//

// Redirect Morgan logging to Winston log files
app.use(morganLogger("combined", { immediate: true, stream }));
app.use(cors());
app.use(cookieParser());

//app.use(
//  session({
//    secret: "test",
//  }),
//);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/tracks", tracksRouter);
app.use("/releases", releasesRouter);
app.use("/artists", artistsRouter);
app.use("/years", yearsRouter);
app.use("/genres", genresRouter);
app.use("/labels", labelsRouter);
app.use("/stats", statsRouter);
app.use("/search", searchRouter);

app.use(on404error); // Catch 404 errors in router above
app.use(expressCustomErrorHandler);

startApp().catch((err) => {
  logger.error(`${__filename}: ${util.inspect(err)}`);
  dbConnection.close();
  process.exit(1);
});
