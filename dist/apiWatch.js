"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = exports.watchSyncEffect = exports.watchPostEffect = exports.watchEffect = void 0;
const ref_1 = require("./ref");
const reactive_1 = require("./reactive");
const util_1 = require("./core/util");
const traverse_1 = require("./core/observer/traverse");
const watcher_1 = __importDefault(require("./core/observer/watcher"));
const scheduler_1 = require("./core/observer/scheduler");
const WATCHER = `watcher`;
const WATCHER_CB = `${WATCHER} callback`;
const WATCHER_GETTER = `${WATCHER} getter`;
const WATCHER_CLEANUP = `${WATCHER} cleanup`;
// Simple effect.
function watchEffect(effect, options) {
    return doWatch(effect, null, options);
}
exports.watchEffect = watchEffect;
function watchPostEffect(effect, options) {
    return doWatch(effect, null, (__DEV__
        ? Object.assign(Object.assign({}, options), { flush: 'post' }) : { flush: 'post' }));
}
exports.watchPostEffect = watchPostEffect;
function watchSyncEffect(effect, options) {
    return doWatch(effect, null, (__DEV__
        ? Object.assign(Object.assign({}, options), { flush: 'sync' }) : { flush: 'sync' }));
}
exports.watchSyncEffect = watchSyncEffect;
// initial value for watchers to trigger on undefined initial values
const INITIAL_WATCHER_VALUE = {};
// implementation
function watch(source, cb, options) {
    if (__DEV__ && typeof cb !== 'function') {
        (0, util_1.warn)(`\`watch(fn, options?)\` signature has been moved to a separate API. ` +
            `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
            `supports \`watch(source, cb, options?) signature.`);
    }
    return doWatch(source, cb, options);
}
exports.watch = watch;
function doWatch(source, cb, { immediate, deep, flush = 'pre', onTrack, onTrigger } = util_1.emptyObject) {
    if (__DEV__ && !cb) {
        if (immediate !== undefined) {
            (0, util_1.warn)(`watch() "immediate" option is only respected when using the ` +
                `watch(source, callback, options?) signature.`);
        }
        if (deep !== undefined) {
            (0, util_1.warn)(`watch() "deep" option is only respected when using the ` +
                `watch(source, callback, options?) signature.`);
        }
    }
    const warnInvalidSource = (s) => {
        (0, util_1.warn)(`Invalid watch source: ${s}. A watch source can only be a getter/effect ` +
            `function, a ref, a reactive object, or an array of these types.`);
    };
    const instance = null;
    const call = (fn, type, args = null) => {
        const res = (0, util_1.invokeWithErrorHandling)(fn, null, args, instance, type);
        if (deep && res && res.__ob__)
            res.__ob__.dep.depend();
        return res;
    };
    let getter;
    let forceTrigger = false;
    let isMultiSource = false;
    if ((0, ref_1.isRef)(source)) {
        getter = () => source.value;
        forceTrigger = (0, reactive_1.isShallow)(source);
    }
    else if ((0, reactive_1.isReactive)(source)) {
        getter = () => {
            ;
            source.__ob__.dep.depend();
            return source;
        };
        deep = true;
    }
    else if ((0, util_1.isArray)(source)) {
        isMultiSource = true;
        forceTrigger = source.some(s => (0, reactive_1.isReactive)(s) || (0, reactive_1.isShallow)(s));
        getter = () => source.map(s => {
            if ((0, ref_1.isRef)(s)) {
                return s.value;
            }
            else if ((0, reactive_1.isReactive)(s)) {
                s.__ob__.dep.depend();
                return (0, traverse_1.traverse)(s);
            }
            else if ((0, util_1.isFunction)(s)) {
                return call(s, WATCHER_GETTER);
            }
            else {
                __DEV__ && warnInvalidSource(s);
            }
        });
    }
    else if ((0, util_1.isFunction)(source)) {
        if (cb) {
            // getter with cb
            getter = () => call(source, WATCHER_GETTER);
        }
        else {
            // no cb -> simple effect
            getter = () => {
                if (cleanup) {
                    cleanup();
                }
                return call(source, WATCHER, [onCleanup]);
            };
        }
    }
    else {
        getter = util_1.noop;
        __DEV__ && warnInvalidSource(source);
    }
    if (cb && deep) {
        const baseGetter = getter;
        getter = () => (0, traverse_1.traverse)(baseGetter());
    }
    let cleanup;
    let onCleanup = (fn) => {
        cleanup = watcher.onStop = () => {
            call(fn, WATCHER_CLEANUP);
        };
    };
    // in SSR there is no need to setup an actual effect, and it should be noop
    // unless it's eager
    if ((0, util_1.isServerRendering)()) {
        // we will also not call the invalidate callback (+ runner is not set up)
        onCleanup = util_1.noop;
        if (!cb) {
            getter();
        }
        else if (immediate) {
            call(cb, WATCHER_CB, [
                getter(),
                isMultiSource ? [] : undefined,
                onCleanup
            ]);
        }
        return util_1.noop;
    }
    const watcher = new watcher_1.default(null, getter, util_1.noop, {
        lazy: true
    });
    watcher.noRecurse = !cb;
    let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
    // overwrite default run
    watcher.run = () => {
        if (!watcher.active) {
            return;
        }
        if (cb) {
            // watch(source, cb)
            const newValue = watcher.get();
            if (deep ||
                forceTrigger ||
                (isMultiSource
                    ? newValue.some((v, i) => (0, util_1.hasChanged)(v, oldValue[i]))
                    : (0, util_1.hasChanged)(newValue, oldValue))) {
                // cleanup before running cb again
                if (cleanup) {
                    cleanup();
                }
                call(cb, WATCHER_CB, [
                    newValue,
                    // pass undefined as the old value when it's changed for the first time
                    oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
                    onCleanup
                ]);
                oldValue = newValue;
            }
        }
        else {
            // watchEffect
            watcher.get();
        }
    };
    if (flush === 'sync') {
        watcher.update = watcher.run;
    }
    else if (flush === 'post') {
        watcher.post = true;
        watcher.update = () => (0, scheduler_1.queueWatcher)(watcher);
    }
    else {
        // pre
        watcher.update = () => {
            (0, scheduler_1.queueWatcher)(watcher);
        };
    }
    if (__DEV__) {
        watcher.onTrack = onTrack;
        watcher.onTrigger = onTrigger;
    }
    // initial run
    if (cb) {
        if (immediate) {
            watcher.run();
        }
        else {
            oldValue = watcher.get();
        }
    }
    else {
        watcher.get();
    }
    return () => {
        watcher.teardown();
    };
}
