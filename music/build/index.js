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
exports.onServerError = exports.onServerListening = void 0;
const http_1 = __importDefault(require("http"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// import cookieParser from "cookie-parser";
//TODO: const session = require("express-session"); // run npm install !!!
const logger_conf_1 = require("./config/logger-conf");
const dbConnection = __importStar(require("./model/postgres"));
const trackModel = __importStar(require("./model/local/track/queries"));
const userModel = __importStar(require("./model/public/user/queries"));
const userSettingsModel = __importStar(require("./model/public/settings/queries"));
const tracks_1 = require("./controller/tracks");
const releases_1 = require("./controller/releases");
const artists_1 = require("./controller/artists");
const years_1 = require("./controller/years");
const genres_1 = require("./controller/genres");
const labels_1 = require("./controller/labels");
const stats_1 = require("./controller/stats");
const helpers_1 = require("./utility/helpers");
const error_handlers_1 = require("./controller/middlewares/error-handlers");
const TrackMetadataParser_1 = require("./TrackMetadataParser");
const constants_1 = require("./utility/constants");
//
function onServerListening() {
    const { port } = server.address();
    logger_conf_1.logger.info(`Listening on port ${port}`);
}
exports.onServerListening = onServerListening;
function onServerError(err) {
    if (err.syscall !== "listen")
        throw err;
    const bind = typeof constants_1.API_SERVER_PORT === "string"
        ? `Pipe ${constants_1.API_SERVER_PORT}`
        : `Port ${constants_1.API_SERVER_PORT}`;
    // Messages for listen errors
    switch (err.code) {
        case "EACCES":
            logger_conf_1.logger.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger_conf_1.logger.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw err;
    }
}
exports.onServerError = onServerError;
function populateDB(dirPath = constants_1.MUSIC_LIB_DIR) {
    return __awaiter(this, void 0, void 0, function* () {
        const fsNodes = yield fs_extra_1.default.readdir(dirPath);
        for (const node of fsNodes) {
            const nodePath = path_1.default.join(dirPath, node);
            if ((yield fs_extra_1.default.stat(nodePath)).isDirectory()) {
                yield populateDB(nodePath);
            }
            else if (constants_1.SUPPORTED_CODEC.includes(helpers_1.getExtensionName(nodePath))) {
                const trackMetadataParser = new TrackMetadataParser_1.TrackMetadataParser(nodePath);
                const metadata = yield trackMetadataParser.parseAudioFile();
                yield trackModel.create(metadata);
            }
        }
    });
}
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield userModel.exists(1)).exists) {
            logger_conf_1.logger.info(`${__filename}: Music library already loaded.`);
            return;
        }
        const { userId } = yield userModel.create(constants_1.DEFAULT_USER_NAME);
        const { settings } = yield userSettingsModel.create(userId, {
            isLibLoaded: false,
        });
        logger_conf_1.logger.info(`${__filename}: Populating db: it may take a few minutes...`);
        yield populateDB(constants_1.MUSIC_LIB_DIR);
        settings.isLibLoaded = true;
        yield userSettingsModel.update(userId, settings);
        logger_conf_1.logger.info(`${__filename}: Populating db: done`);
    });
}
//
process.on("uncaughtException", error_handlers_1.onUncaughtException);
process.on("unhandledRejection", error_handlers_1.onUnhandledRejection);
const app = express_1.default();
const server = http_1.default.createServer(app);
app.set("port", constants_1.API_SERVER_PORT);
server.on("error", onServerError);
server.on("listening", onServerListening);
server.listen(constants_1.API_SERVER_PORT);
//
// Middleware stack
//
// Redirect Morgan logging to Winston log files
app.use(morgan_1.default("combined", { immediate: true, stream: logger_conf_1.stream }));
app.use(cors_1.default());
// app.use(session({}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/tracks", tracks_1.router);
app.use("/releases", releases_1.router);
app.use("/artists", artists_1.router);
app.use("/years", years_1.router);
app.use("/genres", genres_1.router);
app.use("/labels", labels_1.router);
app.use("/stats", stats_1.router);
app.use(error_handlers_1.on404error); // Catch 404 errors in router above
app.use(error_handlers_1.expressCustomErrorHandler);
startApp().catch((err) => {
    logger_conf_1.logger.error(`${__filename}: ${util_1.default.inspect(err)}`);
    dbConnection.close();
    process.exit(1);
});
//# sourceMappingURL=index.js.map