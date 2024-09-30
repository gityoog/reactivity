"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRef = exports.toRefs = exports.customRef = exports.proxyWithRefUnwrap = exports.proxyRefs = exports.unref = exports.triggerRef = exports.shallowRef = exports.ref = exports.isRef = exports.RefFlag = void 0;
const observer_1 = require("./core/observer");
const reactive_1 = require("./reactive");
const dep_1 = __importDefault(require("./core/observer/dep"));
const util_1 = require("./core/util");
const isDev_1 = require("./core/util/isDev");
/**
 * @internal
 */
exports.RefFlag = `__v_isRef`;
function isRef(r) {
    return !!(r && r.__v_isRef === true);
}
exports.isRef = isRef;
function ref(value) {
    return createRef(value, false);
}
exports.ref = ref;
function shallowRef(value) {
    return createRef(value, true);
}
exports.shallowRef = shallowRef;
function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
        return rawValue;
    }
    const ref = {};
    (0, util_1.def)(ref, exports.RefFlag, true);
    (0, util_1.def)(ref, "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */, shallow);
    (0, util_1.def)(ref, 'dep', (0, observer_1.defineReactive)(ref, 'value', rawValue, null, shallow, (0, util_1.isServerRendering)()));
    return ref;
}
function triggerRef(ref) {
    if ((0, isDev_1.isDev)() && !ref.dep) {
        (0, util_1.warn)(`received object is not a triggerable ref.`);
    }
    if ((0, isDev_1.isDev)()) {
        ref.dep &&
            ref.dep.notify({
                type: "set" /* TriggerOpTypes.SET */,
                target: ref,
                key: 'value'
            });
    }
    else {
        ref.dep && ref.dep.notify();
    }
}
exports.triggerRef = triggerRef;
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
exports.unref = unref;
function proxyRefs(objectWithRefs) {
    if ((0, reactive_1.isReactive)(objectWithRefs)) {
        return objectWithRefs;
    }
    const proxy = {};
    const keys = Object.keys(objectWithRefs);
    for (let i = 0; i < keys.length; i++) {
        proxyWithRefUnwrap(proxy, objectWithRefs, keys[i]);
    }
    return proxy;
}
exports.proxyRefs = proxyRefs;
function proxyWithRefUnwrap(target, source, key) {
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: () => {
            const val = source[key];
            if (isRef(val)) {
                return val.value;
            }
            else {
                const ob = val && val.__ob__;
                if (ob)
                    ob.dep.depend();
                return val;
            }
        },
        set: value => {
            const oldValue = source[key];
            if (isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
            }
            else {
                source[key] = value;
            }
        }
    });
}
exports.proxyWithRefUnwrap = proxyWithRefUnwrap;
function customRef(factory) {
    const dep = new dep_1.default();
    const { get, set } = factory(() => {
        if ((0, isDev_1.isDev)()) {
            dep.depend({
                target: ref,
                type: "get" /* TrackOpTypes.GET */,
                key: 'value'
            });
        }
        else {
            dep.depend();
        }
    }, () => {
        if ((0, isDev_1.isDev)()) {
            dep.notify({
                target: ref,
                type: "set" /* TriggerOpTypes.SET */,
                key: 'value'
            });
        }
        else {
            dep.notify();
        }
    });
    const ref = {
        get value() {
            return get();
        },
        set value(newVal) {
            set(newVal);
        }
    };
    (0, util_1.def)(ref, exports.RefFlag, true);
    return ref;
}
exports.customRef = customRef;
function toRefs(object) {
    if ((0, isDev_1.isDev)() && !(0, reactive_1.isReactive)(object)) {
        (0, util_1.warn)(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = (0, util_1.isArray)(object) ? new Array(object.length) : {};
    for (const key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}
exports.toRefs = toRefs;
function toRef(object, key, defaultValue) {
    const val = object[key];
    if (isRef(val)) {
        return val;
    }
    const ref = {
        get value() {
            const val = object[key];
            return val === undefined ? defaultValue : val;
        },
        set value(newVal) {
            object[key] = newVal;
        }
    };
    (0, util_1.def)(ref, exports.RefFlag, true);
    return ref;
}
exports.toRef = toRef;
