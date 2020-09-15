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
const mm = require("music-metadata");
const Sanitizer = require("./utility/Sanitizer.js");
const util = require("util");
const { createConf, getConf, updateConf } = require("./utility/appConf.js");
const getExtensionName = require("./utility/getExtensionName.js");

const { PORT, MUSIC_LIB_PATH, CONF_PATH } = process.env;
const SUPPORTED_CODEC = process.env.SUPPORTED_CODEC.split(",");

process.on("uncaughtException", (err) => {
  logger.error(`uncaughtException: ${err.message} \n${err.stack}`);
  db.close();
  process.exit(1);
});

process.on("unhandledRejection", (reason, p) => {
  logger.error(
    `UnhandledRejection: ${console.dir(p, {
      depth: null,
    })}, reason "${reason}"`,
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

// On application start check option "initialized: false" in config file.
// If it is "initialized: false", then start scanning tracks adding to db.
// If the database is filled with tracks, set this option to "true"

const defaultConf = {
  isLibLoaded: false,
};

async function startApp(confPath = CONF_PATH, confObj = defaultConf) {
  if (!(await fs.pathExists(confPath))) await createConf(confPath, confObj);
  const conf = await getConf(confPath);

  if (!conf.isLibLoaded) {
    logger.info(`${__filename}: Populating db: it may take a few minutes...`);
    await populateDB(MUSIC_LIB_PATH);
    await updateConf(conf, "isLibLoaded", true);
    logger.info(`${__filename}: Populating db: done!`);
  } else {
    logger.info(`${__filename}: Your music library already loaded.`);
  }
}

async function getMetadata(filePath) {
  const mmData = await mm.parseFile(filePath);
  const metadata = { ...mmData, filePath };
  return metadata;
}

function getSanitizedMetadata({ filePath, format, common }) {
  const sanitized = {
    filePath: new Sanitizer(filePath).toString().trim().value,
    year: new Sanitizer(common.year).toInt().value,
    extension: new Sanitizer(format.codec).toString().toExtension().trim()
      .value,
    artist: new Sanitizer(common.artist).toString().trim().value,
    duration: new Sanitizer(format.duration).toFloat().value,
    bitrate: new Sanitizer(format.bitrate).toInt().value,
    trackNo: new Sanitizer(common.track.no).toInt().value,
    title: new Sanitizer(common.title).toString().trim().value,
    album: new Sanitizer(common.album).toString().trim().value,
    diskNo: new Sanitizer(common.disk.no).toInt().value,
    label: new Sanitizer(common.copyright).toString().trim().value,
    genre: new Sanitizer(common.genre).toArr().value,
  };

  return sanitized;
}

function isSupportedCodec(extensionName = "") {
  if (!SUPPORTED_CODEC.includes(extensionName)) return false;
  else return true;
}

async function populateDB(dirPath = MUSIC_LIB_PATH) {
  const fsNodes = await fs.readdir(dirPath);

  for (let node of fsNodes) {
    const nodePath = path.join(dirPath, node);

    if ((await fs.stat(nodePath)).isDirectory()) {
      await populateDB(nodePath);
    } else if (isSupportedCodec(getExtensionName(nodePath))) {
      const metadata = await getMetadata(nodePath);
      const sanitized = getSanitizedMetadata(metadata);
      await db.create(sanitized);
    }
  }
}
/*
const watcher = chokidar.watch(MUSIC_LIB_PATH, {
  recursive: true,
  usePolling: true,
  alwaysStat: true,
  persistent: true,
});

async function onAddHandler(nodePath) {
  logger.info(`watcher: ${nodePath}`);
  if (isSupportedCodec(getExtensionName(nodePath))) {
    const metadata = await getMetadata(nodePath);
    const sanitized = getSanitizedMetadata(metadata);
    await db.create(sanitized);
  }
  logger.info(`File "${nodePath}" has been added`);
}

function onChangeHandler(path) {
  //db.update(path);
  logger.info("File", path, "has been changed");
}

function onUnlinkHandler(path) {
  db.destroy(path); // you should pass `id` instead of path
  logger.info("File", path, "has been removed");
}

function onErrorHandler(err) {
  logger.error("Error happened", err);
}
*/
startApp(CONF_PATH, defaultConf)
  .then(() => {
    return db.read(2);
  })
  .catch((err) => {
    logger.error(`${__filename}: ${err}`);
    db.close();
    process.exit(1);
  });
/*
// this is a test function, delete it
async function update(id, nodePath) {
  const metadata = await getMetadata(nodePath);
  const sanitized = getSanitizedMetadata(metadata);
  sanitized.filePath = "test";
  //await db.create(sanitized);
  console.log(sanitized);
  return db.update(id, sanitized);
}

update(
  1,
  "/music/Al Johnson - Back For More/03. Kylie Minogue - Chocolate (Tom Middleton Cosmos Mix).flac",
)
  .then(logger.info)
  .then(() => {
    watcher
      .on("add", onAddHandler)
      .on("change", onChangeHandler)
      .on("unlink", onUnlinkHandler)
      .on("error", onErrorHandler);
  })
  .catch((err) => {
    logger.error(`${__filename}: ${err}`);
  });
*/
