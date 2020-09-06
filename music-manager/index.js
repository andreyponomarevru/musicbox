#!/usr/bin/env node

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

const logger = require("./utility/loggerConf.js");
const morganLogger = require("morgan");
const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");
const db = require("./model/track/postgres.js");
const { moduleWithError } = require("./utility/moduleWithError.js");
const mm = require("music-metadata");
const Sanitizer = require("./utility/Sanitizer.js");

const { PORT, MUSIC_LIB_PATH, CONF_PATH } = process.env;
const SUPPORTED_CODEC = process.env.SUPPORTED_CODEC.split(",");

// -

process.on("uncaughtException", (err) => {
  logger.error(`uncaughtException: ${err.message} \n${err.stack}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
  logger.error(
    `UnhandledRejection: ${console.dir(p, { depth: null })}, reson "${reason}"`,
  );
});

// const app = express();
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "pug");

//
// Express middleware stack
//

// Redirect Morgan logging to Winston Log files
//app.use(morganLogger('combined', {
//  immediate: true, stream: logger.stream
//}));

// Catch 404 and forward to Express custom error handler
//app.use((req, res, next) => {
//  const err = new Error("Oops! Not Found");
//  err.status = 404;
//  next(err);
//});

// Express error handler
//app.use((err, req, res, next) => {
//  winstonLogger.error(`Express Custom Error Handler ${err.stack}`);
//  // set locals, only providing error in development
//  res.locals.status = err.status || 500;
//  res.locals.error = req.app.get("env") === "development" ? err : {};
//
//  res.status(err.status || 500);
//  res.render("error");
//});

//const libPath =//await askLibPath();

// FIX: you don't need config functions, delete them but copy to another file for some future project ideas

async function loadConf(confPath, libPath) {
  if (!(await fs.pathExists(libPath))) {
    throw new Error(`Music library path ${libPath} is incorrect`);
  } else if (await fs.pathExists(confPath)) {
    return await readConf(confPath);
  } else {
    return await createConf(confPath, libPath);
  }
}

async function createConf(confPath, libPath) {
  const data = JSON.stringify({ libPath });
  await fs.writeFile(confPath, data, { encoding: "utf8" });
  return libPath;
}

async function readConf(confPath) {
  const contents = await fs.readFile(confPath, { encoding: "utf8" });
  const config = JSON.parse(contents);
  return config.libPath;
}

async function getMetadata(filePath) {
  const mmData = await mm.parseFile(filePath);

  const metadata = { ...mmData, filePath };
  return metadata;
}

async function populateDB(dirPath) {
  const fsNodes = await fs.readdir(dirPath);

  for (let node of fsNodes) {
    const nodePath = path.join(dirPath, node);
    const nodeStats = await fs.stat(nodePath);

    if (nodeStats.isDirectory()) {
      await populateDB(nodePath);
    } else if (SUPPORTED_CODEC.includes(path.extname(nodePath))) {
      const inputData = await getMetadata(nodePath);
      const { filePath, format, common } = inputData;
      const sanitizedData = {
        filePath: Sanitizer.sanitize(filePath).toStr().trim().value,
        year: Sanitizer.sanitize(common.year).toInt().value,
        extension: Sanitizer.sanitize(format.codec).toStr().toExtension().trim()
          .value,
        artist: Sanitizer.sanitize(common.artist).toStr().trim().value,
        duration: Sanitizer.sanitize(format.duration).toFloat().value,
        bitrate: Sanitizer.sanitize(format.bitrate).toInt().value,
        trackNo: Sanitizer.sanitize(common.track.no).toInt().value,
        title: Sanitizer.sanitize(common.title).toStr().trim().value,
        album: Sanitizer.sanitize(common.album).toStr().trim().value,
        diskNo: Sanitizer.sanitize(common.disk.no).toInt().value,
        label: Sanitizer.sanitize(common.copyright).toStr().trim().value,
        genre: Sanitizer.sanitize(common.genre).toArr().value,
      };

      console.dir(sanitizedData);

      try {
        db.create(sanitizedData);
      } catch (err) {
        logger.error(err);
      }
    }
  }
}

/*
const watcher = chokidar.watch(MUSIC_LIB_PATH, { recursive: true, usePolling: true, alwaysStat: true, persistent: true }); 

function onAddHandler(path) {
  db.create(path);
  logger.info('File', path, 'has been added');
}

function onChangeHandler(path) {
  db.update(path);
  logger.info('File', path, 'has been changed');
}

function onUnlinkHandler(path) {
  tracksDB.destroy(path);
  logger.info('File', path, 'has been removed');
}

function onErrorHandler(err) {
  logger.error('Error happened', err);
}

watcher
  .on('add', onAddHandler)
  .on('change', onChangeHandler)
  .on('unlink', onUnlinkHandler)
  .on('error', onErrorHandler)
*/

loadConf(CONF_PATH, MUSIC_LIB_PATH)
  .then(populateDB)
  .catch((err) => {
    logger.error(`${err.message} - ${err.stack}`);
  });
