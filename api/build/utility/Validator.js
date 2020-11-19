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
exports.Validator = void 0;
const ValidationError_1 = require("./ValidationError");
const ValidationErrorsCollection_1 = require("./ValidationErrorsCollection");
function isMinMax(arg) {
    if (arg !== null && typeof arg === "object") {
        // TODO: check for min and max props
        return true;
    }
    return false;
}
function includes(arg) {
    if (Array.isArray(arg)) {
        return arg.every((el) => typeof el === "string" || typeof el === "number");
    }
    return false;
}
//
class Validator {
    constructor(_schema) {
        this._schema = _schema;
        this._errors = [];
    }
    get errors() {
        return this._errors;
    }
    isLength(sourceValue, target /*{ min, max }: MinMax*/) {
        if (isMinMax(target)) {
            if (sourceValue === null) {
                sourceValue = "";
            }
            else if (typeof sourceValue === "string") {
                return (sourceValue.length >= target.min && sourceValue.length <= target.max);
            }
        }
        return false;
    }
    isRange(sourceValue, target /*{ min, max }: MinMax*/) {
        if (isMinMax(target)) {
            if (sourceValue === null)
                sourceValue = 0;
            if (typeof sourceValue === "number") {
                return sourceValue >= target.min && sourceValue <= target.max;
            }
        }
        return false;
    }
    includes(sourceValue, target /* targetValues: (string | number)[]*/) {
        if (includes(target)) {
            if (typeof sourceValue === "string" || typeof sourceValue === "number") {
                return target.includes(sourceValue);
            }
        }
        return false;
    }
    validate(unvalidatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key in unvalidatedData) {
                const sourceValue = unvalidatedData[key];
                for (const rule in this._schema[key]) {
                    const targetValue = this._schema[key][rule];
                    const method = this[`_${rule}`];
                    if (targetValue) {
                        const validationResult = method(sourceValue, targetValue);
                        if (!validationResult) {
                            const text = `Invalid value "${sourceValue}" in "${key}" property`;
                            const error = new ValidationError_1.ValidationError(unvalidatedData.filePath, text);
                            this._errors.push(error);
                        }
                    }
                }
            }
            if (this._errors.length > 0) {
                throw new ValidationErrorsCollection_1.ValidationErrorsCollection("Validation Failed: ", this._errors);
            }
            else
                return true;
        });
    }
}
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map