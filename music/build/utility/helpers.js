"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLocalCoverPath = exports.buildApiCoverPath = exports.getExtensionName = exports.styleCamelCase = void 0;
const path_1 = __importDefault(require("path"));
const constants_1 = require("./../utility/constants");
function styleCamelCase(str) {
    function hypenToUpperCase(match, offset, string) {
        console.log(match, offset, string);
        return offset > 0 ? string[offset + 1].toUpperCase() : "";
    }
    return str.replace(/-[a-z0-9]{0,1}/g, hypenToUpperCase);
}
exports.styleCamelCase = styleCamelCase;
function getExtensionName(nodePath) {
    return path_1.default.extname(nodePath).slice(1).toLowerCase();
}
exports.getExtensionName = getExtensionName;
function buildApiCoverPath(filename) {
    return `${constants_1.IMG_DIR_URL}/${filename}`;
}
exports.buildApiCoverPath = buildApiCoverPath;
function buildLocalCoverPath(filename) {
    return `${constants_1.IMG_LOCAL_DIR}/${filename}`;
}
exports.buildLocalCoverPath = buildLocalCoverPath;
//# sourceMappingURL=helpers.js.map