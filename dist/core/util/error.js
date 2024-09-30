"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeWithErrorHandling = exports.handleError = void 0;
const config_1 = __importDefault(require("../config"));
const debug_1 = require("./debug");
const env_1 = require("./env");
const util_1 = require("../../shared/util");
const dep_1 = require("../observer/dep");
function handleError(err, vm, info) {
    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
    // See: https://github.com/vuejs/vuex/issues/1505
    (0, dep_1.pushTarget)();
    try {
        if (vm) {
            let cur = vm;
            while ((cur = cur.$parent)) {
                const hooks = cur.$options.errorCaptured;
                if (hooks) {
                    for (let i = 0; i < hooks.length; i++) {
                        try {
                            const capture = hooks[i].call(cur, err, vm, info) === false;
                            if (capture)
                                return;
                        }
                        catch (e) {
                            globalHandleError(e, cur, 'errorCaptured hook');
                        }
                    }
                }
            }
        }
        globalHandleError(err, vm, info);
    }
    finally {
        (0, dep_1.popTarget)();
    }
}
exports.handleError = handleError;
function invokeWithErrorHandling(handler, context, args, vm, info) {
    let res;
    try {
        res = args ? handler.apply(context, args) : handler.call(context);
        if (res && !res._isVue && (0, util_1.isPromise)(res) && !res._handled) {
            res.catch(e => handleError(e, vm, info + ` (Promise/async)`));
            res._handled = true;
        }
    }
    catch (e) {
        handleError(e, vm, info);
    }
    return res;
}
exports.invokeWithErrorHandling = invokeWithErrorHandling;
function globalHandleError(err, vm, info) {
    if (config_1.default.errorHandler) {
        try {
            return config_1.default.errorHandler.call(null, err, vm, info);
        }
        catch (e) {
            // if the user intentionally throws the original error in the handler,
            // do not log it twice
            if (e !== err) {
                logError(e, null, 'config.errorHandler');
            }
        }
    }
    logError(err, vm, info);
}
function logError(err, vm, info) {
    if (__DEV__) {
        (0, debug_1.warn)(`Error in ${info}: "${err.toString()}"`, vm);
    }
    /* istanbul ignore else */
    if (env_1.inBrowser && typeof console !== 'undefined') {
        console.error(err);
    }
    else {
        throw err;
    }
}
