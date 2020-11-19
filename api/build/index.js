"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const mm = __importStar(require("music-metadata"));
const loggerConf_1 = require("./config/loggerConf");
const dbConnection = __importStar(require("./model/postgres"));
const db = __importStar(require("./model/track/queries"));
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
const Sanitizer_1 = require("./utility/Sanitizer");
const appConf_1 = require("./config/appConf");
const getExtensionName_1 = require("./utility/getExtensionName");
const error_handlers_1 = require("./error-handlers");
const API_SERVER_PORT = Number(process.env.API_SERVER_PORT);
const { MUSIC_LIB_PATH, CONF_PATH } = process.env;
const SUPPORTED_CODEC = process.env
    .SUPPORTED_CODEC.split(",");
// TODO:
// save isLibLoaded in browser cookie
process.on("uncaughtException", error_handlers_1.onUncaughtException);
process.on("unhandledRejection", error_handlers_1.onUnhandledRejection);
//
const app = express_1.default();
const server = http_1.default.createServer(app);
app.use(cors_1.default());
app.set("port", API_SERVER_PORT);
server.listen(API_SERVER_PORT);
server.on("error", error_handlers_1.onServerError);
server.on("listening", onServerListening);
// Redirect Morgan logging to Winston log files
app.use(morgan_1.default("combined", { immediate: true, stream: loggerConf_1.stream }));
// app.use(session({}));
app.set("views", path_1.default.join(__dirname, "views"));
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
app.use(error_handlers_1.on404error); // Catch 404 errors in router above
app.use(error_handlers_1.expressCustomErrorHandler);
function startApp(confPath = CONF_PATH) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield fs_extra_1.default.pathExists(confPath))) {
            throw new Error(`Config path doesn't exist`);
        }
        const conf = yield appConf_1.readConf(confPath);
        if (!conf.isLibLoaded) {
            loggerConf_1.logger.debug(`${__filename}: Populating db: it may take a few minutes...`);
            yield populateDB(MUSIC_LIB_PATH);
            yield appConf_1.updateConf(CONF_PATH, conf, "isLibLoaded", true);
            loggerConf_1.logger.debug(`${__filename}: Populating db: done`);
        }
        else {
            loggerConf_1.logger.debug(`${__filename}: Music library already loaded.`);
        }
    });
}
function collectMetadata(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const mmData = yield mm.parseFile(filePath);
        const metadata = Object.assign(Object.assign({}, mmData), { filePath });
        return metadata;
    });
}
function getSanitizedMetadata(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            filePath: new Sanitizer_1.Sanitizer(metadata.filePath).trim().value,
            extension: metadata.format.codec,
            artist: metadata.common.artists || [],
            duration: metadata.format.duration,
            bitrate: metadata.format.bitrate,
            year: metadata.common.year,
            trackNo: metadata.common.track.no,
            title: metadata.common.title,
            album: metadata.common.album,
            diskNo: metadata.common.disk.no,
            label: metadata.common.copyright,
            genre: metadata.common.genre || [],
        };
    });
}
function isSupportedCodec(extensionName) {
    if (!SUPPORTED_CODEC.includes(extensionName))
        return false;
    else
        return true;
}
function populateDB(dirPath = MUSIC_LIB_PATH) {
    return __awaiter(this, void 0, void 0, function* () {
        const fsNodes = yield fs_extra_1.default.readdir(dirPath);
        for (const node of fsNodes) {
            const nodePath = path_1.default.join(dirPath, node);
            if ((yield fs_extra_1.default.stat(nodePath)).isDirectory()) {
                yield populateDB(nodePath);
            }
            else if (isSupportedCodec(getExtensionName_1.getExtensionName(nodePath))) {
                const metadata = yield collectMetadata(nodePath);
                const sanitized = yield getSanitizedMetadata(metadata);
                //logger.debug(sanitized);
                yield db.create(sanitized);
            }
        }
    });
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
    const { port } = server.address();
    loggerConf_1.logger.info(`Listening on port ${port}`);
}
startApp(CONF_PATH)
    .then(() => {
    // return db.read(2);
})
    .catch((err) => {
    loggerConf_1.logger.error(`${__filename}: ${util_1.default.inspect(err)}`);
    dbConnection.close();
    process.exit(1);
});
//# sourceMappingURL=index.js.map