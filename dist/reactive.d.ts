import { Observer } from './core/observer';
import type { Ref, UnwrapRefSimple, RawSymbol } from './ref';
export declare const enum ReactiveFlags {
    SKIP = "__v_skip",
    IS_READONLY = "__v_isReadonly",
    IS_SHALLOW = "__v_isShallow",
    RAW = "__v_raw"
}
export interface Target {
    __ob__?: Observer;
    [ReactiveFlags.SKIP]?: boolean;
    [ReactiveFlags.IS_READONLY]?: boolean;
    [ReactiveFlags.IS_SHALLOW]?: boolean;
    [ReactiveFlags.RAW]?: any;
}
export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRefSimple<T>;
export declare function reactive<T extends object>(target: T): UnwrapNestedRefs<T>;
export declare const ShallowReactiveMarker: unique symbol;
export type ShallowReactive<T> = T & {
    [ShallowReactiveMarker]?: true;
};
/**
 * Return a shallowly-reactive copy of the original object, where only the root
 * level properties are reactive. It also does not auto-unwrap refs (even at the
 * root level).
 */
export declare function shallowReactive<T extends object>(target: T): ShallowReactive<T>;
export declare function isReactive(value: unknown): boolean;
export declare function isShallow(value: unknown): boolean;
export declare function isReadonly(value: unknown): boolean;
export declare function isProxy(value: unknown): boolean;
export declare function toRaw<T>(observed: T): T;
export declare function markRaw<T extends object>(value: T): T & {
    [RawSymbol]?: true;
};
/**
 * @internal
 */
export declare function isCollectionType(value: unknown): boolean;
