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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const Validator_1 = require("../../utility/Validator");
function validate(object, schema) {
    return __awaiter(this, void 0, void 0, function* () {
        const validator = new Validator_1.Validator(schema);
        yield validator.validate(object);
        if (validator.errors.length > 0)
            throw validator.errors;
        else {
            const validated = Object.assign({}, object);
            return validated;
        }
    });
}
exports.validate = validate;
//# sourceMappingURL=validate.js.map