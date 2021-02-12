import http from "http";
import { AddressInfo } from "net";
import fs from "fs-extra";
import path from "path";
import util from "util";

import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import morganLogger from "morgan";
import * as mm from "music-metadata";
import Jimp from "jimp";
// import cookieParser from "cookie-parser";
//TODO: const session = require("express-session"); // run npm install !!!

import { logger, stream } from "./config/loggerConf";
import * as dbConnection from "./model/postgres";
import * as trackModel from "./model/track/localQueries";
import * as userModel from "./model/user/queries";
import * as userSettingsModel from "./model/settings/queries";
import { router as tracksRouter } from "./controller/tracks";
import { router as releasesRouter } from "./controller/releases";
import { router as artistsRouter } from "./controller/artists";
import { router as yearsRouter } from "./controller/years";
import { router as genresRouter } from "./controller/genres";
import { router as labelsRouter } from "./controller/labels";
import { router as statsRouter } from "./controller/stats";
import { Sanitizer } from "./utility/Sanitizer";
import { replaceSpaces, getExtensionName } from "./utility/helpers";
import {
  onUncaughtException,
  onUnhandledRejection,
  onServerError,
  expressCustomErrorHandler,
  on404error,
} from "./utility/middlewares/error-handlers";

import {
  TrackMetadata,
  CatNo,
  CoverPath,
  FilePath,
  ReleaseMetadata,
} from "./types";

import {
  SUPPORTED_CODEC,
  API_SERVER_PORT,
  MUSIC_LIB_DIR,
  IMG_LOCAL_DIR,
  IMG_DIR_URL,
  DEFAULT_COVER_URL,
  DEFAULT_USER_NAME,
  DEFAULT_USER_ID,
} from "./utility/constants";

//

process.on("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);

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
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/tracks", tracksRouter);
app.use("/releases", releasesRouter);
app.use("/artists", artistsRouter);
app.use("/years", yearsRouter);
app.use("/genres", genresRouter);
app.use("/labels", labelsRouter);
app.use("/stats", statsRouter);

//
// Express middleware stack
//

app.use(on404error); // Catch 404 errors in router above
app.use(expressCustomErrorHandler);

class TrackMetadataParser {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async parseAudioFile(): Promise<TrackMetadata> {
    const trackMetadata = await mm.parseFile(this.filePath);
    if (trackMetadata.common.artist) {
      console.log(trackMetadata.common.artist.split("; "));
    }

    const coverPath = await this.parseCover(
      this.filePath,
      trackMetadata.common.picture,
    );
    const extension = this.parseExtension(this.filePath);
    const duration = this.parseDuration(trackMetadata.format.duration);
    const bitrate = this.parseBitrate(trackMetadata.format.bitrate);
    const trackArtist = this.parseTrackArtist(trackMetadata.common.artist);
    const releaseArtist = this.parseReleaseArtist(
      trackMetadata.common.artist,
      trackMetadata.common.album,
    );
    const year = this.parseYear(trackMetadata.common.year);
    const trackNo = this.parseTrackNo(trackMetadata.common.track.no);
    const trackTitle = this.parseTrackTitle(trackMetadata.common.title);
    const releaseTitle = this.parseReleaseTitle(trackMetadata.common.album);
    const diskNo = this.parseDiskNo(trackMetadata.common.disk.no);
    const label = this.parseLabel(trackMetadata.common.copyright);
    const genre = this.parseGenre(trackMetadata.common.genre);
    const catNo = this.parseCommentToCatNo(trackMetadata.common.comment);

    const extendedMetadata = {
      filePath: this.filePath,
      coverPath,
      extension,
      duration,
      bitrate,
      releaseArtist,
      trackArtist,
      year,
      trackNo,
      trackTitle,
      releaseTitle,
      diskNo,
      label,
      genre,
      catNo,
    };

    return extendedMetadata;
  }

  private parseDuration(duration: number | undefined) {
    return duration || 0;
  }

  private parseBitrate(bitrate: number | undefined) {
    return bitrate || 0;
  }

  private parseYear(year: number | undefined) {
    return year || 0;
  }

  private parseLabel(name: string | undefined) {
    return name || "Unknown";
  }

  private parseTrackTitle(title: string | undefined) {
    return title || "";
  }

  private parseDiskNo(diskNo: number | undefined) {
    return diskNo || null;
  }

  private parseTrackNo(no: number | undefined) {
    return no || null;
  }

  private parseReleaseTitle(releaseTitle: string | undefined) {
    if (releaseTitle) {
      if (/Various - /.test(releaseTitle)) {
        return releaseTitle.split("Various - ")[1];
      } else return releaseTitle;
    } else return "";
  }

  private parseTrackArtist(name: string | undefined) {
    if (name === undefined) return ["Unknown"];
    else return [...name.split("; ")];
  }

  private parseReleaseArtist(
    artistName: string | undefined,
    releaseTitle: string | undefined,
  ) {
    if (releaseTitle) {
      if (/Various - /.test(releaseTitle)) {
        return "Various";
      } else if (artistName) {
        return artistName.split("; ")[0];
      } else return "Unknown";
    }
    return "Unknown";
  }

  private parseGenre(genre: string[] | undefined) {
    if (Array.isArray(genre)) return [...genre[0].split("; ")];
    else return ["Unknown"];
  }

  private parseExtension(filePath: string) {
    return path.extname(filePath).slice(1);
  }

  private async parseCover(filePath: string, image: mm.IPicture[] | undefined) {
    const coverName = path.parse(filePath).name;
    const coverMetadata = image ? { name: coverName, ...image[0] } : null;

    if (coverMetadata) {
      const extension = coverMetadata.format.split("/")[1];
      const normalizedName = await replaceSpaces(coverMetadata.name);
      const fullname = `${normalizedName}.${extension}`;

      const buffer = coverMetadata.data;
      const apiImagePath = `${IMG_DIR_URL}/${fullname}`;
      const localImagePath = `${IMG_LOCAL_DIR}/${fullname}`;

      await fs.writeFile(localImagePath, buffer);
      await this.optimizeImage(localImagePath);
      return apiImagePath;
    } else {
      return DEFAULT_COVER_URL;
    }
  }

  private async optimizeImage(path: string) {
    const image = await Jimp.read(path);
    image.resize(450, 450).quality(60).write(path);
  }

  private parseCommentToCatNo(comment: string[] | undefined) {
    if (Array.isArray(comment)) {
      const regex = /[\w\s{0,1}-]+/;
      const catNo = regex.exec(comment[0]);

      return catNo ? catNo[0] : null;
    } else return null;
  }
}
/*
// TODO: perform sanitization
export async function getSanitizedMetadata(
  metadata: TrackMetadata | UpdateTrackMetadata,
): Promise<TrackMetadata | UpdateTrackMetadata> {
  const sanitizedMetadata = {
    filePath: metadata.filePath,
    extension: metadata.extension,
    trackArtist: metadata.trackArtist,
    releaseArtist: metadata.releaseArtist,
    duration: metadata.duration,
    bitrate: metadata.bitrate,
    year: metadata.year,
    trackNo: metadata.trackNo,
    trackTitle: metadata.trackTitle,
    releaseTitle: metadata.releaseTitle,
    diskNo: metadata.diskNo,
    label: metadata.label,
    genre: metadata.genre,
    coverPath: metadata.coverPath,
    catNo: metadata.catNo,
  };

  if (metadata.hasOwnProperty("trackId"))
    Object.assign(sanitizedMetadata, metadata.trackId);
  if (metadata.hasOwnProperty("releaseId"))
    Object.assign(sanitizedMetadata, metadata.releaseId);

  return sanitizedMetadata;
}
*/
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
  if ((await userModel.exists(DEFAULT_USER_ID)).exists) {
    logger.info(`${__filename}: Music library already loaded.`);
    return;
  }

  const { userId } = await userModel.create(DEFAULT_USER_NAME);
  const { settings } = await userSettingsModel.create(userId, {
    isLibLoaded: false,
  });

  logger.info(`${__filename}: Populating db: it may take a few minutes...`);
  await populateDB(MUSIC_LIB_DIR);
  settings.isLibLoaded = true;
  await userSettingsModel.update(userId, settings);
  logger.info(`${__filename}: Populating db: done`);
}

function onServerListening() {
  const { port } = server.address() as AddressInfo;
  logger.info(`Listening on port ${port}`);
}

startApp().catch((err) => {
  logger.error(`${__filename}: ${util.inspect(err)}`);
  dbConnection.close();
  process.exit(1);
});
