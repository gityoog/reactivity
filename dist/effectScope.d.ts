import Watcher from './core/observer/watcher';
export declare let activeEffectScope: EffectScope | undefined;
export declare class EffectScope {
    detached: boolean;
    /**
     * @internal
     */
    active: boolean;
    /**
     * @internal
     */
    effects: Watcher[];
    /**
     * @internal
     */
    cleanups: (() => void)[];
    /**
     * @internal
     */
    parent: EffectScope | undefined;
    /**
     * record undetached scopes
     * @internal
     */
    scopes: EffectScope[] | undefined;
    /**
     * indicates this being a component root scope
     * @internal
     */
    _vm?: boolean;
    /**
     * track a child scope's index in its parent's scopes array for optimized
     * removal
     */
    private index;
    constructor(detached?: boolean);
    run<T>(fn: () => T): T | undefined;
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on(): void;
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off(): void;
    stop(fromParent?: boolean): void;
}
export declare function effectScope(detached?: boolean): EffectScope;
/**
 * @internal
 */
export declare function recordEffectScope(effect: Watcher, scope?: EffectScope | undefined): void;
export declare function getCurrentScope(): EffectScope | undefined;
export declare function onScopeDispose(fn: () => void): void;
