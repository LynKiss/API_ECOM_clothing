"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToBoolean = ToBoolean;
const class_transformer_1 = require("class-transformer");
function normalizeBoolean(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null || value === '') {
        return undefined;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        if (value === 1) {
            return true;
        }
        if (value === 0) {
            return false;
        }
    }
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (['true', '1', 'yes', 'on'].includes(normalized)) {
            return true;
        }
        if (['false', '0', 'no', 'off'].includes(normalized)) {
            return false;
        }
    }
    return value;
}
function ToBoolean() {
    return (0, class_transformer_1.Transform)(({ value }) => normalizeBoolean(value));
}
//# sourceMappingURL=dto-transformers.js.map