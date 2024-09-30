"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tip = exports.warn = void 0;
const config_1 = __importDefault(require("../config"));
const util_1 = require("../../shared/util");
exports.warn = util_1.noop;
exports.tip = util_1.noop;
if (__DEV__) {
    const hasConsole = typeof console !== 'undefined';
    exports.warn = (msg, vm = null) => {
        const trace = '';
        if (config_1.default.warnHandler) {
            config_1.default.warnHandler.call(null, msg, vm, trace);
        }
        else if (hasConsole && !config_1.default.silent) {
            console.error(`[Vue warn]: ${msg}${trace}`);
        }
    };
    exports.tip = (msg, vm) => {
        if (hasConsole && !config_1.default.silent) {
            console.warn(`[Vue tip]: ${msg}`);
        }
    };
}
