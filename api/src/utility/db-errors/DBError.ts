import { errorCodes } from "./errorCodes";

export class DBError {
  code: number;
  message?: string;
  more_info?: string;

  constructor(
    errorCode: number,
    message?: string,
    more_info = "https://www.postgresql.org/docs",
  ) {
    this.code = errorCode;
    this.message = message;
    this.more_info = more_info;

    if (this.message === undefined) this.message = errorCodes[errorCode];
  }
}
