"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(origin, message) {
        super(message);
        this.origin = origin;
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidationError.js.map