"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationErrorsCollection = void 0;
class ValidationErrorsCollection extends Error {
    constructor(message, errors) {
        super(message);
        this.errors = errors;
    }
}
exports.ValidationErrorsCollection = ValidationErrorsCollection;
//# sourceMappingURL=ValidationErrorsCollection.js.map