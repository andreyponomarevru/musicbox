import http from "http";
import { AddressInfo } from "net";
import fs from "fs-extra";
import path from "path";
import util from "util";

import express from "express";
import cors from "cors";
import morganLogger from "morgan";

import { logger, stream } from "./config/logger";
import * as dbConnection from "./models/postgres";
import * as trackModel from "./models/local/track/queries";
import * as userModel from "./models/public/user/queries";
import * as userSettingsModel from "./models/public/settings/queries";
import { router as tracksRouter } from "./controllers/tracks";
import { router as releasesRouter } from "./controllers/releases";
import { router as artistsRouter } from "./controllers/artists";
import { router as yearsRouter } from "./controllers/years";
import { router as genresRouter } from "./controllers/genres";
import { router as labelsRouter } from "./controllers/labels";
import { router as statsRouter } from "./controllers/stats";
import { router as searchRouter } from "./controllers/search";
import { getExtensionName } from "./utility";
import {
  onUncaughtException,
  onUnhandledRejection,
  expressCustomErrorHandler,
  on404error,
  onServerError,
} from "./controllers/middlewares/error-handlers";
import { TrackMetadataParser } from "./models/track-metadata-parser";

import swaggerUI from "swagger-ui-express";
import { swaggerDocument } from "./swagger";

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

async function populateDB(dirPath = MUSIC_LIB_DIR) {
  const fsNodes = await fs.readdir(dirPath);

  for (const node of fsNodes) {
    const nodePath = path.join(dirPath, node);

    if ((await fs.stat(nodePath)).isDirectory()) {
      await populateDB(nodePath);
    } else if (SUPPORTED_CODEC.includes(getExtensionName(nodePath))) {
      const trackMetadataParser = new TrackMetadataParser(nodePath);
      const metadata = await trackMetadataParser.parseAudioFile();

      logger.info(`Adding track ${util.inspect(metadata.filePath)} to db ...`);
      await trackModel.create(metadata);
      logger.info(`Track successfully added.`);
    }
  }
}

async function startApp() {
  const isUserExist = (await userModel.exists(1)).exists;

  if (!isUserExist) {
    await userModel.create(DEFAULT_USERNAME);
    await userSettingsModel.create(1, { isLibLoaded: false });
  }

  const user = await userModel.read(1);

  if (!user.settings.isLibLoaded) {
    logger.info(`${__filename}: Populating db: it may take a while ...`);

    await populateDB(MUSIC_LIB_DIR);
    await userSettingsModel.update(1, {
      ...user.settings,
      isLibLoaded: true,
    });

    logger.info(`${__filename}: Populating db: done`);
  }
}

//

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);

const app = express();
const server = http.createServer(app);

app.set("port", PORT);

server.on("error", onServerError);
server.on("listening", onServerListening);

server.listen(PORT);

//
// Middleware stack
//

// Redirect Morgan logging to Winston log files
const morganSettings = { immediate: true, stream };
app.use(morganLogger("combined", morganSettings));
app.use(cors());

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
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(on404error); // Catch 404 errors in router above
app.use(expressCustomErrorHandler);

startApp().catch((err) => {
  logger.error(`${__filename}: ${util.inspect(err)}`);
  dbConnection.close();
  process.exit(1);
});
