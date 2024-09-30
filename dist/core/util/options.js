"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAsset = exports.validateComponentName = exports.mergeLifecycleHook = exports.mergeDataOrFn = void 0;
const config_1 = __importDefault(require("../config"));
const debug_1 = require("./debug");
const index_1 = require("../observer/index");
const lang_1 = require("./lang");
const env_1 = require("./env");
const util_1 = require("../../shared/util");
const constants_1 = require("../../shared/constants");
const util_2 = require("../../shared/util");
/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
const strats = config_1.default.optionMergeStrategies;
/**
 * Options with restrictions
 */
if (__DEV__) {
    strats.el = strats.propsData = function (parent, child, vm, key) {
        if (!vm) {
            (0, debug_1.warn)(`option "${key}" can only be used during instance ` +
                'creation with the `new` keyword.');
        }
        return defaultStrat(parent, child);
    };
}
/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to, from, recursive = true) {
    if (!from)
        return to;
    let key, toVal, fromVal;
    const keys = env_1.hasSymbol
        ? Reflect.ownKeys(from)
        : Object.keys(from);
    for (let i = 0; i < keys.length; i++) {
        key = keys[i];
        // in case the object is already observed...
        if (key === '__ob__')
            continue;
        toVal = to[key];
        fromVal = from[key];
        if (!recursive || !(0, util_2.hasOwn)(to, key)) {
            (0, index_1.set)(to, key, fromVal);
        }
        else if (toVal !== fromVal &&
            (0, util_2.isPlainObject)(toVal) &&
            (0, util_2.isPlainObject)(fromVal)) {
            mergeData(toVal, fromVal);
        }
    }
    return to;
}
/**
 * Data
 */
function mergeDataOrFn(parentVal, childVal, vm) {
    if (!vm) {
        // in a Vue.extend merge, both should be functions
        if (!childVal) {
            return parentVal;
        }
        if (!parentVal) {
            return childVal;
        }
        // when parentVal & childVal are both present,
        // we need to return a function that returns the
        // merged result of both functions... no need to
        // check if parentVal is a function here because
        // it has to be a function to pass previous merges.
        return function mergedDataFn() {
            return mergeData((0, util_1.isFunction)(childVal) ? childVal.call(this, this) : childVal, (0, util_1.isFunction)(parentVal) ? parentVal.call(this, this) : parentVal);
        };
    }
    else {
        return function mergedInstanceDataFn() {
            // instance merge
            const instanceData = (0, util_1.isFunction)(childVal)
                ? childVal.call(vm, vm)
                : childVal;
            const defaultData = (0, util_1.isFunction)(parentVal)
                ? parentVal.call(vm, vm)
                : parentVal;
            if (instanceData) {
                return mergeData(instanceData, defaultData);
            }
            else {
                return defaultData;
            }
        };
    }
}
exports.mergeDataOrFn = mergeDataOrFn;
strats.data = function (parentVal, childVal, vm) {
    if (!vm) {
        if (childVal && typeof childVal !== 'function') {
            __DEV__ &&
                (0, debug_1.warn)('The "data" option should be a function ' +
                    'that returns a per-instance value in component ' +
                    'definitions.', vm);
            return parentVal;
        }
        return mergeDataOrFn(parentVal, childVal);
    }
    return mergeDataOrFn(parentVal, childVal, vm);
};
/**
 * Hooks and props are merged as arrays.
 */
function mergeLifecycleHook(parentVal, childVal) {
    const res = childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : (0, util_1.isArray)(childVal)
                ? childVal
                : [childVal]
        : parentVal;
    return res ? dedupeHooks(res) : res;
}
exports.mergeLifecycleHook = mergeLifecycleHook;
function dedupeHooks(hooks) {
    const res = [];
    for (let i = 0; i < hooks.length; i++) {
        if (res.indexOf(hooks[i]) === -1) {
            res.push(hooks[i]);
        }
    }
    return res;
}
constants_1.LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeLifecycleHook;
});
/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(parentVal, childVal, vm, key) {
    const res = Object.create(parentVal || null);
    if (childVal) {
        __DEV__ && assertObjectType(key, childVal, vm);
        return (0, util_2.extend)(res, childVal);
    }
    else {
        return res;
    }
}
constants_1.ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
});
/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal, vm, key) {
    // work around Firefox's Object.prototype.watch...
    //@ts-expect-error work around
    if (parentVal === env_1.nativeWatch)
        parentVal = undefined;
    //@ts-expect-error work around
    if (childVal === env_1.nativeWatch)
        childVal = undefined;
    /* istanbul ignore if */
    if (!childVal)
        return Object.create(parentVal || null);
    if (__DEV__) {
        assertObjectType(key, childVal, vm);
    }
    if (!parentVal)
        return childVal;
    const ret = {};
    (0, util_2.extend)(ret, parentVal);
    for (const key in childVal) {
        let parent = ret[key];
        const child = childVal[key];
        if (parent && !(0, util_1.isArray)(parent)) {
            parent = [parent];
        }
        ret[key] = parent ? parent.concat(child) : (0, util_1.isArray)(child) ? child : [child];
    }
    return ret;
};
/**
 * Other object hashes.
 */
strats.props =
    strats.methods =
        strats.inject =
            strats.computed =
                function (parentVal, childVal, vm, key) {
                    if (childVal && __DEV__) {
                        assertObjectType(key, childVal, vm);
                    }
                    if (!parentVal)
                        return childVal;
                    const ret = Object.create(null);
                    (0, util_2.extend)(ret, parentVal);
                    if (childVal)
                        (0, util_2.extend)(ret, childVal);
                    return ret;
                };
strats.provide = function (parentVal, childVal) {
    if (!parentVal)
        return childVal;
    return function () {
        const ret = Object.create(null);
        mergeData(ret, (0, util_1.isFunction)(parentVal) ? parentVal.call(this) : parentVal);
        if (childVal) {
            mergeData(ret, (0, util_1.isFunction)(childVal) ? childVal.call(this) : childVal, false // non-recursive
            );
        }
        return ret;
    };
};
/**
 * Default strategy.
 */
const defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
};
/**
 * Validate component names
 */
function checkComponents(options) {
    for (const key in options.components) {
        validateComponentName(key);
    }
}
function validateComponentName(name) {
    if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${lang_1.unicodeRegExp.source}]*$`).test(name)) {
        (0, debug_1.warn)('Invalid component name: "' +
            name +
            '". Component names ' +
            'should conform to valid custom element name in html5 specification.');
    }
    if ((0, util_2.isBuiltInTag)(name) || config_1.default.isReservedTag(name)) {
        (0, debug_1.warn)('Do not use built-in or reserved HTML elements as component ' +
            'id: ' +
            name);
    }
}
exports.validateComponentName = validateComponentName;
/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps(options, vm) {
    const props = options.props;
    if (!props)
        return;
    const res = {};
    let i, val, name;
    if ((0, util_1.isArray)(props)) {
        i = props.length;
        while (i--) {
            val = props[i];
            if (typeof val === 'string') {
                name = (0, util_2.camelize)(val);
                res[name] = { type: null };
            }
            else if (__DEV__) {
                (0, debug_1.warn)('props must be strings when using array syntax.');
            }
        }
    }
    else if ((0, util_2.isPlainObject)(props)) {
        for (const key in props) {
            val = props[key];
            name = (0, util_2.camelize)(key);
            res[name] = (0, util_2.isPlainObject)(val) ? val : { type: val };
        }
    }
    else if (__DEV__) {
        (0, debug_1.warn)(`Invalid value for option "props": expected an Array or an Object, ` +
            `but got ${(0, util_2.toRawType)(props)}.`, vm);
    }
    options.props = res;
}
/**
 * Normalize all injections into Object-based format
 */
function normalizeInject(options, vm) {
    const inject = options.inject;
    if (!inject)
        return;
    const normalized = (options.inject = {});
    if ((0, util_1.isArray)(inject)) {
        for (let i = 0; i < inject.length; i++) {
            normalized[inject[i]] = { from: inject[i] };
        }
    }
    else if ((0, util_2.isPlainObject)(inject)) {
        for (const key in inject) {
            const val = inject[key];
            normalized[key] = (0, util_2.isPlainObject)(val)
                ? (0, util_2.extend)({ from: key }, val)
                : { from: val };
        }
    }
    else if (__DEV__) {
        (0, debug_1.warn)(`Invalid value for option "inject": expected an Array or an Object, ` +
            `but got ${(0, util_2.toRawType)(inject)}.`, vm);
    }
}
/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives(options) {
    const dirs = options.directives;
    if (dirs) {
        for (const key in dirs) {
            const def = dirs[key];
            if ((0, util_1.isFunction)(def)) {
                dirs[key] = { bind: def, update: def };
            }
        }
    }
}
function assertObjectType(name, value, vm) {
    if (!(0, util_2.isPlainObject)(value)) {
        (0, debug_1.warn)(`Invalid value for option "${name}": expected an Object, ` +
            `but got ${(0, util_2.toRawType)(value)}.`, vm);
    }
}
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset(options, type, id, warnMissing) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
        return;
    }
    const assets = options[type];
    // check local registration variations first
    if ((0, util_2.hasOwn)(assets, id))
        return assets[id];
    const camelizedId = (0, util_2.camelize)(id);
    if ((0, util_2.hasOwn)(assets, camelizedId))
        return assets[camelizedId];
    const PascalCaseId = (0, util_2.capitalize)(camelizedId);
    if ((0, util_2.hasOwn)(assets, PascalCaseId))
        return assets[PascalCaseId];
    // fallback to prototype chain
    const res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    if (__DEV__ && warnMissing && !res) {
        (0, debug_1.warn)('Failed to resolve ' + type.slice(0, -1) + ': ' + id);
    }
    return res;
}
exports.resolveAsset = resolveAsset;
