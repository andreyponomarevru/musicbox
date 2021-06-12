/*
 * Winston logger
 */

// TIP: Winston Logging Levels:
// 0: error, 1: warn, 2: info, 3: verbose, 4: debug, 5: silly

import winston from "winston";
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, colorize, printf } = format;

const { LOG_LOCATION, ERROR_LOG_NAME, INFO_LOG_NAME, NODE_ENV } = process.env;

const APP_NAME = "musicbox";

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${level} [${timestamp}] ${label.toUpperCase()}: ${message}`;
});

// Write all logs with level 'debug' and below to console
const consoleTransport = new transports.Console({
  level: "debug",
  format: combine(
    label({ label: APP_NAME }),
    timestamp(),
    colorize({ all: true }),
    logFormat,
  ),
});

// Write all logs with level 'error' and below to ERROR_LOG_NAME
const errorFileTransport = new transports.File({
  level: "error",
  filename: `${LOG_LOCATION}/${ERROR_LOG_NAME}`,
  maxsize: 5242880, // 5MB
  maxFiles: 2,
  format: combine(label({ label: APP_NAME }), timestamp(), logFormat),
});

// Write all logs with level 'info' and below to INFO_LOG_NAME
const infoFileTransport = new transports.File({
  level: "info",
  filename: `${LOG_LOCATION}/${INFO_LOG_NAME}`,
  maxsize: 5242880, // 5MB
  maxFiles: 2,
  format: combine(label({ label: APP_NAME }), timestamp(), logFormat),
});

function createTransports(env = "development") {
  return env === "development"
    ? [consoleTransport]
    : [errorFileTransport, infoFileTransport];
}

const logger = createLogger({
  transports: [...createTransports(NODE_ENV)],
  exitOnError: false, // do not exit on uncaughtException
});

// Put Morgan logs inside Winston logs,
// Create a stream object that will be used by Morgan. Later we will use this
// function to get morgan-generated output into the winston log files
const stream = {
  write: (message: string): void => {
    // use the 'info' log level. The output will be picked up by both
    // transports (file and console)
    logger.info(message);
  },
};

export { logger, stream };
