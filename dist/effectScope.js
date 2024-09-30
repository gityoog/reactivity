"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onScopeDispose = exports.getCurrentScope = exports.recordEffectScope = exports.effectScope = exports.EffectScope = exports.activeEffectScope = void 0;
const util_1 = require("./core/util");
const isDev_1 = require("./core/util/isDev");
class EffectScope {
    constructor(detached = false) {
        this.detached = detached;
        /**
         * @internal
         */
        this.active = true;
        /**
         * @internal
         */
        this.effects = [];
        /**
         * @internal
         */
        this.cleanups = [];
        this.parent = exports.activeEffectScope;
        if (!detached && exports.activeEffectScope) {
            this.index =
                (exports.activeEffectScope.scopes || (exports.activeEffectScope.scopes = [])).push(this) - 1;
        }
    }
    run(fn) {
        if (this.active) {
            const currentEffectScope = exports.activeEffectScope;
            try {
                exports.activeEffectScope = this;
                return fn();
            }
            finally {
                exports.activeEffectScope = currentEffectScope;
            }
        }
        else if ((0, isDev_1.isDev)()) {
            (0, util_1.warn)(`cannot run an inactive effect scope.`);
        }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
        exports.activeEffectScope = this;
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
        exports.activeEffectScope = this.parent;
    }
    stop(fromParent) {
        if (this.active) {
            let i, l;
            for (i = 0, l = this.effects.length; i < l; i++) {
                this.effects[i].teardown();
            }
            for (i = 0, l = this.cleanups.length; i < l; i++) {
                this.cleanups[i]();
            }
            if (this.scopes) {
                for (i = 0, l = this.scopes.length; i < l; i++) {
                    this.scopes[i].stop(true);
                }
            }
            // nested scope, dereference from parent to avoid memory leaks
            if (!this.detached && this.parent && !fromParent) {
                // optimized O(1) removal
                const last = this.parent.scopes.pop();
                if (last && last !== this) {
                    this.parent.scopes[this.index] = last;
                    last.index = this.index;
                }
            }
            this.parent = undefined;
            this.active = false;
        }
    }
}
exports.EffectScope = EffectScope;
function effectScope(detached) {
    return new EffectScope(detached);
}
exports.effectScope = effectScope;
/**
 * @internal
 */
function recordEffectScope(effect, scope = exports.activeEffectScope) {
    if (scope && scope.active) {
        scope.effects.push(effect);
    }
}
exports.recordEffectScope = recordEffectScope;
function getCurrentScope() {
    return exports.activeEffectScope;
}
exports.getCurrentScope = getCurrentScope;
function onScopeDispose(fn) {
    if (exports.activeEffectScope) {
        exports.activeEffectScope.cleanups.push(fn);
    }
    else if ((0, isDev_1.isDev)()) {
        (0, util_1.warn)(`onScopeDispose() is called when there is no active effect scope` +
            ` to be associated with.`);
    }
}
exports.onScopeDispose = onScopeDispose;
