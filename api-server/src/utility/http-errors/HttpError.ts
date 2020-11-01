import { errors } from "./errors";

export class HttpError {
  constructor(
    public errorCode: number,
    public message?: string,
    public more_info = "https://github.com/ponomarevandrey/musicbox",
  ) {
    if (this.message === undefined) this.message = errors[errorCode];
  }
}
