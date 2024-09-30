import Dep, { DepTarget } from './dep';
import { DebuggerEvent, DebuggerOptions } from '../../debug';
import type { SimpleSet } from '../util/index';
import type { Component } from '../../types/component';
/**
 * @internal
 */
export interface WatcherOptions extends DebuggerOptions {
    deep?: boolean;
    user?: boolean;
    lazy?: boolean;
    sync?: boolean;
    before?: Function;
}
/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 * @internal
 */
export default class Watcher implements DepTarget {
    vm?: Component | null;
    expression: string;
    cb: Function;
    id: number;
    deep: boolean;
    user: boolean;
    lazy: boolean;
    sync: boolean;
    dirty: boolean;
    active: boolean;
    deps: Array<Dep>;
    newDeps: Array<Dep>;
    depIds: SimpleSet;
    newDepIds: SimpleSet;
    before?: Function;
    onStop?: Function;
    noRecurse?: boolean;
    getter: Function;
    value: any;
    post: boolean;
    onTrack?: ((event: DebuggerEvent) => void) | undefined;
    onTrigger?: ((event: DebuggerEvent) => void) | undefined;
    constructor(vm: Component | null, expOrFn: string | (() => any), cb: Function, options?: WatcherOptions | null, isRenderWatcher?: boolean);
    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    get(): any;
    /**
     * Add a dependency to this directive.
     */
    addDep(dep: Dep): void;
    /**
     * Clean up for dependency collection.
     */
    cleanupDeps(): void;
    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    update(): void;
    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    run(): void;
    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    evaluate(): void;
    /**
     * Depend on all deps collected by this watcher.
     */
    depend(): void;
    /**
     * Remove self from all dependencies' subscriber list.
     */
    teardown(): void;
}
