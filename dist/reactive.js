"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCollectionType = exports.markRaw = exports.toRaw = exports.isProxy = exports.isReadonly = exports.isShallow = exports.isReactive = exports.shallowReactive = exports.reactive = void 0;
const observer_1 = require("./core/observer");
const util_1 = require("./core/util");
function reactive(target) {
    makeReactive(target, false);
    return target;
}
exports.reactive = reactive;
/**
 * Return a shallowly-reactive copy of the original object, where only the root
 * level properties are reactive. It also does not auto-unwrap refs (even at the
 * root level).
 */
function shallowReactive(target) {
    makeReactive(target, true);
    (0, util_1.def)(target, "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */, true);
    return target;
}
exports.shallowReactive = shallowReactive;
function makeReactive(target, shallow) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (!isReadonly(target)) {
        if (__DEV__) {
            if ((0, util_1.isArray)(target)) {
                (0, util_1.warn)(`Avoid using Array as root value for ${shallow ? `shallowReactive()` : `reactive()`} as it cannot be tracked in watch() or watchEffect(). Use ${shallow ? `shallowRef()` : `ref()`} instead. This is a Vue-2-only limitation.`);
            }
            const existingOb = target && target.__ob__;
            if (existingOb && existingOb.shallow !== shallow) {
                (0, util_1.warn)(`Target is already a ${existingOb.shallow ? `` : `non-`}shallow reactive object, and cannot be converted to ${shallow ? `` : `non-`}shallow.`);
            }
        }
        const ob = (0, observer_1.observe)(target, shallow, (0, util_1.isServerRendering)() /* ssr mock reactivity */);
        if (__DEV__ && !ob) {
            if (target == null || (0, util_1.isPrimitive)(target)) {
                (0, util_1.warn)(`value cannot be made reactive: ${String(target)}`);
            }
            if (isCollectionType(target)) {
                (0, util_1.warn)(`Vue 2 does not support reactive collection types such as Map or Set.`);
            }
        }
    }
}
function isReactive(value) {
    if (isReadonly(value)) {
        return isReactive(value["__v_raw" /* ReactiveFlags.RAW */]);
    }
    return !!(value && value.__ob__);
}
exports.isReactive = isReactive;
function isShallow(value) {
    return !!(value && value.__v_isShallow);
}
exports.isShallow = isShallow;
function isReadonly(value) {
    return !!(value && value.__v_isReadonly);
}
exports.isReadonly = isReadonly;
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
exports.isProxy = isProxy;
function toRaw(observed) {
    const raw = observed && observed["__v_raw" /* ReactiveFlags.RAW */];
    return raw ? toRaw(raw) : observed;
}
exports.toRaw = toRaw;
function markRaw(value) {
    // non-extensible objects won't be observed anyway
    if (Object.isExtensible(value)) {
        (0, util_1.def)(value, "__v_skip" /* ReactiveFlags.SKIP */, true);
    }
    return value;
}
exports.markRaw = markRaw;
/**
 * @internal
 */
function isCollectionType(value) {
    const type = (0, util_1.toRawType)(value);
    return (type === 'Map' || type === 'WeakMap' || type === 'Set' || type === 'WeakSet');
}
exports.isCollectionType = isCollectionType;
