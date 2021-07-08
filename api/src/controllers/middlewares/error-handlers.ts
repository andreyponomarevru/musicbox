import util from "util";

import { Request, Response, NextFunction } from "express";
import { ValidationError as JoiValidationError } from "joi";

import * as dbConnection from "../../models/postgres";
import { HttpError } from "./http-errors/HttpError";
import { logger } from "../../config/logger";

const PORT = Number(process.env.PORT);

//
// Error handlers
//

export function onUncaughtException(err: Error): void {
  logger.error(`uncaughtException: ${err.message} \n${err.stack}`);
  dbConnection.close();
  process.exit(1);
}

export function onUnhandledRejection(reason: string, p: unknown): void {
  logger.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
}

// Forward 404 errors to Express custom error handler
export function on404error(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error(`Error 404 forwarded to Express custom error handler`);
  next(new HttpError(404));
}

// Express custom error handler
// - handle errors passed to next() handler
// - handle errors thrown inside route handler
export function expressCustomErrorHandler(
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error(`Express Custom Error Handler\n${util.inspect(err)}`);

  if (err instanceof HttpError) {
    res.status(err.errorCode);
    res.json(err);
  } else if (err instanceof JoiValidationError) {
    res.status(400);
    res.json(
      new HttpError(400, err.details.map((err) => err.message).join("; ")),
    );
  } else {
    res.status(500);
    res.json(new HttpError(500));
    throw err;
  }
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
