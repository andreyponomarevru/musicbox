// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

const cors = require("cors");
const express = require("express");
const logger = require("./utility/loggerConf.js");
const morganLogger = require("morgan");
const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");
const db = require("./model/track/postgres.js");
const mm = require("music-metadata");
const Sanitizer = require("./utility/Sanitizer.js");
const { createConf, getConf, updateConf } = require("./utility/appConf.js");
const getExtensionName = require("./utility/getExtensionName.js");
const http = require("http");
const { normalizePort } = require("./utility/normalizePort.js");
const cookieParser = require("cookie-parser");
//const { router: setupRouter } = require("./routes/setup.js");
const { router: indexRouter } = require("./routes/index.js");
const { router: artistRouter } = require("./routes/artists.js");
//const session = require("express-session"); // run npm install !!!

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

const { API_SERVER_PORT, MUSIC_LIB_PATH, CONF_PATH } = process.env;
const SUPPORTED_CODEC = process.env.SUPPORTED_CODEC.split(",");
const defaultConf = { isLibLoaded: false };

const app = express();
const server = http.createServer(app);
app.use(cors());
const port = normalizePort(API_SERVER_PORT || "3000");
app.set("port", port);
server.listen(port);
server.on("error", onServerError);
server.on("listening", onServerListening);

// Redirect Morgan logging to Winston log files
app.use(morganLogger("combined", { immediate: true, stream: logger.stream }));

// app.use(session({}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser); -- it hangs the server!
//app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
//app.use("/setup", setupRouter);
app.use("/artists", artistRouter);

//
// Express middleware stack
//

// Catch 404 and forward to Express custom error handler
app.use((req, res, next) => {
  const err = new Error("Oops! Not Found");
  err.status = 404;
  next(err);
});

// Express custom error handler
// - handle errors passed to next() handler
// - handle errors thrown inside route handler
app.use((err, req, res, next) => {
  logger.error(`Express Custom Error Handler ${err.stack}`);
  // set locals, only providing error in development
  res.locals.status = err.status || 500;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

async function startApp(confPath = CONF_PATH, confObj = defaultConf) {
  if (!(await fs.pathExists(confPath))) await createConf(confPath, confObj);
  const conf = await getConf(confPath);

  // TODO: config is not stored between container start/down
  if (!conf.isLibLoaded) {
    logger.debug(`${__filename}: Populating db: it may take a few minutes...`);
    await populateDB(MUSIC_LIB_PATH);
    await updateConf(conf, "isLibLoaded", true);
    logger.debug(`${__filename}: Populating db: done`);
  } else {
    logger.debug(`${__filename}: Music library already loaded.`);
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
    artist: new Sanitizer(common.artists).toArr().value,
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
      //logger.debug(sanitized);
      //await db.create(sanitized);
    }
  }
}

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
//    const metadata = await getMetadata(nodePath);
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

//function onServerErrorHandler(err) {
//  logger.error("Error happened", err);
//}

function onServerError(err) {
  if (err.syscall !== "listen") throw err;

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

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

function onServerListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`);
}

// On application start check if config file exists: if it does, read it to
// find out whether the db is already filled with data and then do nothing.
// In case config doesn't exist, create it and then start adding tracks to db.
startApp(CONF_PATH, defaultConf)
  .then(() => {
    // return db.read(2);
  })
  .catch((err) => {
    logger.error(`${__filename}: ${err}`);
    db.close();
    process.exit(1);
  });

// these exports are only for testing purposes, delete them:
module.exports.getSanitizedMetadata = getSanitizedMetadata;
module.exports.getMetadata = getMetadata;
