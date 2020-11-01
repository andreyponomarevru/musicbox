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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onServerError = exports.expressCustomErrorHandler = exports.on404error = exports.onUnhandledRejection = exports.onUncaughtException = void 0;
const dbConnection = __importStar(require("./model/postgres"));
const HttpError_1 = require("./utility/http-errors/HttpError");
const loggerConf_1 = require("./config/loggerConf");
const util_1 = __importDefault(require("util"));
const { API_SERVER_PORT } = process.env;
//
// Error handlers
//
function onUncaughtException(err) {
    loggerConf_1.logger.error(`uncaughtException: ${err.message} \n${err.stack}`);
    dbConnection.close();
    process.exit(1);
}
exports.onUncaughtException = onUncaughtException;
function onUnhandledRejection(reason, p) {
    loggerConf_1.logger.error(`UnhandledRejection: ${console.dir(p, {
        depth: null,
    })}, reason "${reason}"`);
}
exports.onUnhandledRejection = onUnhandledRejection;
// Forward 404 errors to Express custom error handler
function on404error(req, res, next) {
    next(new HttpError_1.HttpError(404));
}
exports.on404error = on404error;
// Express custom error handler
// - handle errors passed to next() handler
// - handle errors thrown inside route handler
function expressCustomErrorHandler(err, req, res, next) {
    loggerConf_1.logger.error(`Express Custom Error Handler ${util_1.default.inspect(err)}`);
    if (err instanceof HttpError_1.HttpError) {
        res.status(err.errorCode);
        res.json(err);
    }
    else {
        res.status(500);
        res.json(new HttpError_1.HttpError(500));
        throw err;
    }
}
exports.expressCustomErrorHandler = expressCustomErrorHandler;
function onServerError(err) {
    if (err.syscall !== "listen")
        throw err;
    const bind = typeof API_SERVER_PORT === "string"
        ? `Pipe ${API_SERVER_PORT}`
        : `Port ${API_SERVER_PORT}`;
    // Messages for listen errors
    switch (err.code) {
        case "EACCES":
            loggerConf_1.logger.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            loggerConf_1.logger.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw err;
    }
}
exports.onServerError = onServerError;
//# sourceMappingURL=error-handlers.js.map