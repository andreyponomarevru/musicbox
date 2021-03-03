"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sanitizer = void 0;
class Sanitizer {
    constructor(input) {
        this.input = input;
    }
    trim() {
        if (typeof this.input === "string") {
            this.input = this.input.trim();
        }
        return this;
    }
    value() {
        return this.input;
    }
}
exports.Sanitizer = Sanitizer;
//# sourceMappingURL=Sanitizer.js.map