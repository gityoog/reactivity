"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverse = void 0;
const index_1 = require("../util/index");
const ref_1 = require("../../ref");
const seenObjects = new Set();
/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse(val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
    return val;
}
exports.traverse = traverse;
function _traverse(val, seen) {
    let i, keys;
    const isA = (0, index_1.isArray)(val);
    if ((!isA && !(0, index_1.isObject)(val)) ||
        val.__v_skip /* ReactiveFlags.SKIP */ ||
        Object.isFrozen(val)) {
        return;
    }
    if (val.__ob__) {
        const depId = val.__ob__.dep.id;
        if (seen.has(depId)) {
            return;
        }
        seen.add(depId);
    }
    if (isA) {
        i = val.length;
        while (i--)
            _traverse(val[i], seen);
    }
    else if ((0, ref_1.isRef)(val)) {
        _traverse(val.value, seen);
    }
    else {
        keys = Object.keys(val);
        i = keys.length;
        while (i--)
            _traverse(val[keys[i]], seen);
    }
}
