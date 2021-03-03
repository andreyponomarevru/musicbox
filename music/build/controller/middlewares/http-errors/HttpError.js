"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
const errorCodes_1 = require("./errorCodes");
class HttpError {
    constructor(errorCode, message, more_info = "https://github.com/ponomarevandrey/musicbox") {
        this.errorCode = errorCode;
        this.message = message;
        this.more_info = more_info;
        if (this.message === undefined)
            this.message = errorCodes_1.errorCodes[errorCode];
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=HttpError.js.map