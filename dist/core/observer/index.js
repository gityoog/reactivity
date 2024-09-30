"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.set = exports.defineReactive = exports.observe = exports.Observer = exports.toggleObserving = exports.shouldObserve = void 0;
const dep_1 = __importDefault(require("./dep"));
const array_1 = require("./array");
const index_1 = require("../util/index");
const reactive_1 = require("../../reactive");
const ref_1 = require("../../ref");
const isDev_1 = require("../util/isDev");
const arrayKeys = Object.getOwnPropertyNames(array_1.arrayMethods);
const NO_INITIAL_VALUE = {};
/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
exports.shouldObserve = true;
function toggleObserving(value) {
    exports.shouldObserve = value;
}
exports.toggleObserving = toggleObserving;
// ssr mock dep
const mockDep = {
    notify: index_1.noop,
    depend: index_1.noop,
    addSub: index_1.noop,
    removeSub: index_1.noop
};
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
class Observer {
    constructor(value, shallow = false, mock = false) {
        this.value = value;
        this.shallow = shallow;
        this.mock = mock;
        // this.value = value
        this.dep = mock ? mockDep : new dep_1.default();
        this.vmCount = 0;
        (0, index_1.def)(value, '__ob__', this);
        if ((0, index_1.isArray)(value)) {
            if (!mock) {
                if (index_1.hasProto) {
                    /* eslint-disable no-proto */
                    ;
                    value.__proto__ = array_1.arrayMethods;
                    /* eslint-enable no-proto */
                }
                else {
                    for (let i = 0, l = arrayKeys.length; i < l; i++) {
                        const key = arrayKeys[i];
                        (0, index_1.def)(value, key, array_1.arrayMethods[key]);
                    }
                }
            }
            if (!shallow) {
                this.observeArray(value);
            }
        }
        else {
            /**
             * Walk through all properties and convert them into
             * getter/setters. This method should only be called when
             * value type is Object.
             */
            const keys = Object.keys(value);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                defineReactive(value, key, NO_INITIAL_VALUE, undefined, shallow, mock);
            }
        }
    }
    /**
     * Observe a list of Array items.
     */
    observeArray(value) {
        for (let i = 0, l = value.length; i < l; i++) {
            observe(value[i], false, this.mock);
        }
    }
}
exports.Observer = Observer;
// helpers
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe(value, shallow, ssrMockReactivity) {
    if (value && (0, index_1.hasOwn)(value, '__ob__') && value.__ob__ instanceof Observer) {
        return value.__ob__;
    }
    if (exports.shouldObserve &&
        (ssrMockReactivity || !(0, index_1.isServerRendering)()) &&
        ((0, index_1.isArray)(value) || (0, index_1.isPlainObject)(value)) &&
        Object.isExtensible(value) &&
        !value.__v_skip /* ReactiveFlags.SKIP */ &&
        !(0, ref_1.isRef)(value)) {
        return new Observer(value, shallow, ssrMockReactivity);
    }
}
exports.observe = observe;
/**
 * Define a reactive property on an Object.
 */
function defineReactive(obj, key, val, customSetter, shallow, mock, observeEvenIfShallow = false) {
    const dep = new dep_1.default();
    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        return;
    }
    // cater for pre-defined getter/setters
    const getter = property && property.get;
    const setter = property && property.set;
    if ((!getter || setter) &&
        (val === NO_INITIAL_VALUE || arguments.length === 2)) {
        val = obj[key];
    }
    let childOb = shallow ? val && val.__ob__ : observe(val, false, mock);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val;
            if (dep_1.default.target) {
                if ((0, isDev_1.isDev)()) {
                    dep.depend({
                        target: obj,
                        type: "get" /* TrackOpTypes.GET */,
                        key
                    });
                }
                else {
                    dep.depend();
                }
                if (childOb) {
                    childOb.dep.depend();
                    if ((0, index_1.isArray)(value)) {
                        dependArray(value);
                    }
                }
            }
            return (0, ref_1.isRef)(value) && !shallow ? value.value : value;
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val;
            if (!(0, index_1.hasChanged)(value, newVal)) {
                return;
            }
            if ((0, isDev_1.isDev)() && customSetter) {
                customSetter();
            }
            if (setter) {
                setter.call(obj, newVal);
            }
            else if (getter) {
                // #7981: for accessor properties without setter
                return;
            }
            else if (!shallow && (0, ref_1.isRef)(value) && !(0, ref_1.isRef)(newVal)) {
                value.value = newVal;
                return;
            }
            else {
                val = newVal;
            }
            childOb = shallow ? newVal && newVal.__ob__ : observe(newVal, false, mock);
            if ((0, isDev_1.isDev)()) {
                dep.notify({
                    type: "set" /* TriggerOpTypes.SET */,
                    target: obj,
                    key,
                    newValue: newVal,
                    oldValue: value
                });
            }
            else {
                dep.notify();
            }
        }
    });
    return dep;
}
exports.defineReactive = defineReactive;
function set(target, key, val) {
    if ((0, isDev_1.isDev)() && ((0, index_1.isUndef)(target) || (0, index_1.isPrimitive)(target))) {
        (0, index_1.warn)(`Cannot set reactive property on undefined, null, or primitive value: ${target}`);
    }
    if ((0, reactive_1.isReadonly)(target)) {
        (0, isDev_1.isDev)() && (0, index_1.warn)(`Set operation on key "${key}" failed: target is readonly.`);
        return;
    }
    const ob = target.__ob__;
    if ((0, index_1.isArray)(target) && (0, index_1.isValidArrayIndex)(key)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        // when mocking for SSR, array methods are not hijacked
        if (ob && !ob.shallow && ob.mock) {
            observe(val, false, true);
        }
        return val;
    }
    if (key in target && !(key in Object.prototype)) {
        target[key] = val;
        return val;
    }
    if (target._isVue || (ob && ob.vmCount)) {
        (0, isDev_1.isDev)() &&
            (0, index_1.warn)('Avoid adding reactive properties to a Vue instance or its root $data ' +
                'at runtime - declare it upfront in the data option.');
        return val;
    }
    if (!ob) {
        target[key] = val;
        return val;
    }
    defineReactive(ob.value, key, val, undefined, ob.shallow, ob.mock);
    if ((0, isDev_1.isDev)()) {
        ob.dep.notify({
            type: "add" /* TriggerOpTypes.ADD */,
            target: target,
            key,
            newValue: val,
            oldValue: undefined
        });
    }
    else {
        ob.dep.notify();
    }
    return val;
}
exports.set = set;
function del(target, key) {
    if ((0, isDev_1.isDev)() && ((0, index_1.isUndef)(target) || (0, index_1.isPrimitive)(target))) {
        (0, index_1.warn)(`Cannot delete reactive property on undefined, null, or primitive value: ${target}`);
    }
    if ((0, index_1.isArray)(target) && (0, index_1.isValidArrayIndex)(key)) {
        target.splice(key, 1);
        return;
    }
    const ob = target.__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
        (0, isDev_1.isDev)() &&
            (0, index_1.warn)('Avoid deleting properties on a Vue instance or its root $data ' +
                '- just set it to null.');
        return;
    }
    if ((0, reactive_1.isReadonly)(target)) {
        (0, isDev_1.isDev)() &&
            (0, index_1.warn)(`Delete operation on key "${key}" failed: target is readonly.`);
        return;
    }
    if (!(0, index_1.hasOwn)(target, key)) {
        return;
    }
    delete target[key];
    if (!ob) {
        return;
    }
    if ((0, isDev_1.isDev)()) {
        ob.dep.notify({
            type: "delete" /* TriggerOpTypes.DELETE */,
            target: target,
            key
        });
    }
    else {
        ob.dep.notify();
    }
}
exports.del = del;
/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        if (e && e.__ob__) {
            e.__ob__.dep.depend();
        }
        if ((0, index_1.isArray)(e)) {
            dependArray(e);
        }
    }
}
