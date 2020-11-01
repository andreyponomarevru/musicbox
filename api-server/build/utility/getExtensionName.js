"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtensionName = void 0;
const path_1 = __importDefault(require("path"));
function getExtensionName(nodePath) {
    return path_1.default.extname(nodePath).slice(1);
}
exports.getExtensionName = getExtensionName;
//# sourceMappingURL=getExtensionName.js.map