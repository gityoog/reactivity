"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const traverse_1 = require("./traverse");
const scheduler_1 = require("./scheduler");
const dep_1 = require("./dep");
const effectScope_1 = require("../../effectScope");
const isDev_1 = require("../util/isDev");
let uid = 0;
/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 * @internal
 */
class Watcher {
    constructor(vm, expOrFn, cb, options, isRenderWatcher) {
        (0, effectScope_1.recordEffectScope)(this, 
        // if the active effect scope is manually created (not a component scope),
        // prioritize it
        effectScope_1.activeEffectScope && !effectScope_1.activeEffectScope._vm
            ? effectScope_1.activeEffectScope
            : vm
                ? vm._scope
                : undefined);
        if ((this.vm = vm) && isRenderWatcher) {
            vm._watcher = this;
        }
        // options
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
            this.before = options.before;
            if ((0, isDev_1.isDev)()) {
                this.onTrack = options.onTrack;
                this.onTrigger = options.onTrigger;
            }
        }
        else {
            this.deep = this.user = this.lazy = this.sync = false;
        }
        this.cb = cb;
        this.id = ++uid; // uid for batching
        this.active = true;
        this.post = false;
        this.dirty = this.lazy; // for lazy watchers
        this.deps = [];
        this.newDeps = [];
        this.depIds = new Set();
        this.newDepIds = new Set();
        this.expression = (0, isDev_1.isDev)() ? expOrFn.toString() : '';
        // parse expression for getter
        if ((0, index_1.isFunction)(expOrFn)) {
            this.getter = expOrFn;
        }
        else {
            this.getter = (0, index_1.parsePath)(expOrFn);
            if (!this.getter) {
                this.getter = index_1.noop;
                (0, isDev_1.isDev)() &&
                    (0, index_1.warn)(`Failed watching path: "${expOrFn}" ` +
                        'Watcher only accepts simple dot-delimited paths. ' +
                        'For full control, use a function instead.', vm);
            }
        }
        this.value = this.lazy ? undefined : this.get();
    }
    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    get() {
        (0, dep_1.pushTarget)(this);
        let value;
        const vm = this.vm;
        try {
            value = this.getter.call(vm, vm);
        }
        catch (e) {
            if (this.user) {
                (0, index_1.handleError)(e, vm, `getter for watcher "${this.expression}"`);
            }
            else {
                throw e;
            }
        }
        finally {
            // "touch" every property so they are all tracked as
            // dependencies for deep watching
            if (this.deep) {
                (0, traverse_1.traverse)(value);
            }
            (0, dep_1.popTarget)();
            this.cleanupDeps();
        }
        return value;
    }
    /**
     * Add a dependency to this directive.
     */
    addDep(dep) {
        const id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    }
    /**
     * Clean up for dependency collection.
     */
    cleanupDeps() {
        let i = this.deps.length;
        while (i--) {
            const dep = this.deps[i];
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }
        let tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    }
    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    update() {
        /* istanbul ignore else */
        if (this.lazy) {
            this.dirty = true;
        }
        else if (this.sync) {
            this.run();
        }
        else {
            (0, scheduler_1.queueWatcher)(this);
        }
    }
    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    run() {
        if (this.active) {
            const value = this.get();
            if (value !== this.value ||
                // Deep watchers and watchers on Object/Arrays should fire even
                // when the value is the same, because the value may
                // have mutated.
                (0, index_1.isObject)(value) ||
                this.deep) {
                // set new value
                const oldValue = this.value;
                this.value = value;
                if (this.user) {
                    const info = `callback for watcher "${this.expression}"`;
                    (0, index_1.invokeWithErrorHandling)(this.cb, this.vm, [value, oldValue], this.vm, info);
                }
                else {
                    this.cb.call(this.vm, value, oldValue);
                }
            }
        }
    }
    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }
    /**
     * Depend on all deps collected by this watcher.
     */
    depend() {
        let i = this.deps.length;
        while (i--) {
            this.deps[i].depend();
        }
    }
    /**
     * Remove self from all dependencies' subscriber list.
     */
    teardown() {
        if (this.vm && !this.vm._isBeingDestroyed) {
            (0, index_1.remove)(this.vm._scope.effects, this);
        }
        if (this.active) {
            let i = this.deps.length;
            while (i--) {
                this.deps[i].removeSub(this);
            }
            this.active = false;
            if (this.onStop) {
                this.onStop();
            }
        }
    }
}
exports.default = Watcher;
