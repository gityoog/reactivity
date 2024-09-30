"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shallowReadonly = exports.readonly = void 0;
const util_1 = require("./core/util");
const isDev_1 = require("./core/util/isDev");
const reactive_1 = require("./reactive");
const ref_1 = require("./ref");
const rawToReadonlyFlag = `__v_rawToReadonly`;
const rawToShallowReadonlyFlag = `__v_rawToShallowReadonly`;
function readonly(target) {
    return createReadonly(target, false);
}
exports.readonly = readonly;
function createReadonly(target, shallow) {
    if (!(0, util_1.isPlainObject)(target)) {
        if ((0, isDev_1.isDev)()) {
            if ((0, util_1.isArray)(target)) {
                (0, util_1.warn)(`Vue 2 does not support readonly arrays.`);
            }
            else if ((0, reactive_1.isCollectionType)(target)) {
                (0, util_1.warn)(`Vue 2 does not support readonly collection types such as Map or Set.`);
            }
            else {
                (0, util_1.warn)(`value cannot be made readonly: ${typeof target}`);
            }
        }
        return target;
    }
    if ((0, isDev_1.isDev)() && !Object.isExtensible(target)) {
        (0, util_1.warn)(`Vue 2 does not support creating readonly proxy for non-extensible object.`);
    }
    // already a readonly object
    if ((0, reactive_1.isReadonly)(target)) {
        return target;
    }
    // already has a readonly proxy
    const existingFlag = shallow ? rawToShallowReadonlyFlag : rawToReadonlyFlag;
    const existingProxy = target[existingFlag];
    if (existingProxy) {
        return existingProxy;
    }
    const proxy = Object.create(Object.getPrototypeOf(target));
    (0, util_1.def)(target, existingFlag, proxy);
    (0, util_1.def)(proxy, "__v_isReadonly" /* ReactiveFlags.IS_READONLY */, true);
    (0, util_1.def)(proxy, "__v_raw" /* ReactiveFlags.RAW */, target);
    if ((0, ref_1.isRef)(target)) {
        (0, util_1.def)(proxy, ref_1.RefFlag, true);
    }
    if (shallow || (0, reactive_1.isShallow)(target)) {
        (0, util_1.def)(proxy, "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */, true);
    }
    const keys = Object.keys(target);
    for (let i = 0; i < keys.length; i++) {
        defineReadonlyProperty(proxy, target, keys[i], shallow);
    }
    return proxy;
}
function defineReadonlyProperty(proxy, target, key, shallow) {
    Object.defineProperty(proxy, key, {
        enumerable: true,
        configurable: true,
        get() {
            const val = target[key];
            return shallow || !(0, util_1.isPlainObject)(val) ? val : readonly(val);
        },
        set() {
            (0, isDev_1.isDev)() &&
                (0, util_1.warn)(`Set operation on key "${key}" failed: target is readonly.`);
        }
    });
}
/**
 * Returns a reactive-copy of the original object, where only the root level
 * properties are readonly, and does NOT unwrap refs nor recursively convert
 * returned properties.
 * This is used for creating the props proxy object for stateful components.
 */
function shallowReadonly(target) {
    return createReadonly(target, true);
}
exports.shallowReadonly = shallowReadonly;
