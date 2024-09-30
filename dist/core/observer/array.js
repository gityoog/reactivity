"use strict";
/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayMethods = void 0;
const index_1 = require("../util/index");
const isDev_1 = require("../util/isDev");
const arrayProto = Array.prototype;
exports.arrayMethods = Object.create(arrayProto);
const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];
/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
    // cache original method
    const original = arrayProto[method];
    (0, index_1.def)(exports.arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args);
        const ob = this.__ob__;
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if (inserted)
            ob.observeArray(inserted);
        // notify change
        if ((0, isDev_1.isDev)()) {
            ob.dep.notify({
                type: "array mutation" /* TriggerOpTypes.ARRAY_MUTATION */,
                target: this,
                key: method
            });
        }
        else {
            ob.dep.notify();
        }
        return result;
    });
});
