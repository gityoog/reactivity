"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDev = exports.del = exports.set = exports.nextTick = exports.getCurrentScope = exports.onScopeDispose = exports.effectScope = exports.EffectScope = exports.watchSyncEffect = exports.watchPostEffect = exports.watchEffect = exports.watch = exports.computed = exports.shallowReadonly = exports.readonly = exports.toRaw = exports.markRaw = exports.shallowReactive = exports.isProxy = exports.isShallow = exports.isReadonly = exports.isReactive = exports.reactive = exports.triggerRef = exports.customRef = exports.proxyRefs = exports.unref = exports.toRefs = exports.toRef = exports.isRef = exports.shallowRef = exports.ref = void 0;
var ref_1 = require("./ref");
Object.defineProperty(exports, "ref", { enumerable: true, get: function () { return ref_1.ref; } });
Object.defineProperty(exports, "shallowRef", { enumerable: true, get: function () { return ref_1.shallowRef; } });
Object.defineProperty(exports, "isRef", { enumerable: true, get: function () { return ref_1.isRef; } });
Object.defineProperty(exports, "toRef", { enumerable: true, get: function () { return ref_1.toRef; } });
Object.defineProperty(exports, "toRefs", { enumerable: true, get: function () { return ref_1.toRefs; } });
Object.defineProperty(exports, "unref", { enumerable: true, get: function () { return ref_1.unref; } });
Object.defineProperty(exports, "proxyRefs", { enumerable: true, get: function () { return ref_1.proxyRefs; } });
Object.defineProperty(exports, "customRef", { enumerable: true, get: function () { return ref_1.customRef; } });
Object.defineProperty(exports, "triggerRef", { enumerable: true, get: function () { return ref_1.triggerRef; } });
var reactive_1 = require("./reactive");
Object.defineProperty(exports, "reactive", { enumerable: true, get: function () { return reactive_1.reactive; } });
Object.defineProperty(exports, "isReactive", { enumerable: true, get: function () { return reactive_1.isReactive; } });
Object.defineProperty(exports, "isReadonly", { enumerable: true, get: function () { return reactive_1.isReadonly; } });
Object.defineProperty(exports, "isShallow", { enumerable: true, get: function () { return reactive_1.isShallow; } });
Object.defineProperty(exports, "isProxy", { enumerable: true, get: function () { return reactive_1.isProxy; } });
Object.defineProperty(exports, "shallowReactive", { enumerable: true, get: function () { return reactive_1.shallowReactive; } });
Object.defineProperty(exports, "markRaw", { enumerable: true, get: function () { return reactive_1.markRaw; } });
Object.defineProperty(exports, "toRaw", { enumerable: true, get: function () { return reactive_1.toRaw; } });
var readonly_1 = require("./readonly");
Object.defineProperty(exports, "readonly", { enumerable: true, get: function () { return readonly_1.readonly; } });
Object.defineProperty(exports, "shallowReadonly", { enumerable: true, get: function () { return readonly_1.shallowReadonly; } });
var computed_1 = require("./computed");
Object.defineProperty(exports, "computed", { enumerable: true, get: function () { return computed_1.computed; } });
var apiWatch_1 = require("./apiWatch");
Object.defineProperty(exports, "watch", { enumerable: true, get: function () { return apiWatch_1.watch; } });
Object.defineProperty(exports, "watchEffect", { enumerable: true, get: function () { return apiWatch_1.watchEffect; } });
Object.defineProperty(exports, "watchPostEffect", { enumerable: true, get: function () { return apiWatch_1.watchPostEffect; } });
Object.defineProperty(exports, "watchSyncEffect", { enumerable: true, get: function () { return apiWatch_1.watchSyncEffect; } });
var effectScope_1 = require("./effectScope");
Object.defineProperty(exports, "EffectScope", { enumerable: true, get: function () { return effectScope_1.EffectScope; } });
Object.defineProperty(exports, "effectScope", { enumerable: true, get: function () { return effectScope_1.effectScope; } });
Object.defineProperty(exports, "onScopeDispose", { enumerable: true, get: function () { return effectScope_1.onScopeDispose; } });
Object.defineProperty(exports, "getCurrentScope", { enumerable: true, get: function () { return effectScope_1.getCurrentScope; } });
var next_tick_1 = require("./core/util/next-tick");
Object.defineProperty(exports, "nextTick", { enumerable: true, get: function () { return next_tick_1.nextTick; } });
var observer_1 = require("./core/observer");
Object.defineProperty(exports, "set", { enumerable: true, get: function () { return observer_1.set; } });
Object.defineProperty(exports, "del", { enumerable: true, get: function () { return observer_1.del; } });
var isDev_1 = require("./core/util/isDev");
Object.defineProperty(exports, "setDev", { enumerable: true, get: function () { return isDev_1.setDev; } });
