"use strict";
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
exports.updateConf = exports.readConf = void 0;
const util_1 = __importDefault(require("util"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const loggerConf_1 = require("./loggerConf");
/*
async function createConf(confPath = CONF_PATH, confObj): Promise<void> {
  const data = JSON.stringify(confObj, null, 2);
  await fs.writeFile(confPath, data, { encoding: "utf8" });
  logger.debug(`${__filename}: conf file created with content:
  ${util.inspect(confObj)}`);
}*/
function readConf(confPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield fs_extra_1.default.readFile(confPath, { encoding: "utf8" });
        const parsed = JSON.parse(config);
        loggerConf_1.logger.debug(`${__filename}: conf file read. Content:
  ${util_1.default.inspect(parsed)}`);
        return parsed;
    });
}
exports.readConf = readConf;
function updateConf(confPath, confObj, prop, value) {
    return __awaiter(this, void 0, void 0, function* () {
        confObj[prop] = value;
        const updatedConf = JSON.stringify(confObj, null, 2);
        yield fs_extra_1.default.writeFile(confPath, updatedConf);
        loggerConf_1.logger.debug(`${__filename}: conf file updated. Content:
  ${util_1.default.inspect(updatedConf)}`);
    });
}
exports.updateConf = updateConf;
//# sourceMappingURL=appConf.js.map