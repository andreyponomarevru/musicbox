"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
const errors_js_1 = require("./errors.js");
class HttpError {
    constructor(errorCode, message, more_info = "https://github.com/ponomarevandrey/musicbox") {
        this.errorCode = errorCode;
        this.message = message;
        this.more_info = more_info;
        if (this.message === undefined)
            this.message = errors_js_1.errors[errorCode];
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=HttpError.js.map