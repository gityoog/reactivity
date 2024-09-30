import { type ShallowReactiveMarker } from './reactive';
import type { IfAny } from './types/utils';
import Dep from './core/observer/dep';
declare const RefSymbol: unique symbol;
export declare const RawSymbol: unique symbol;
/**
 * @internal
 */
export declare const RefFlag = "__v_isRef";
export interface Ref<T = any> {
    value: T;
    /**
     * Type differentiator only.
     * We need this to be in public d.ts but don't want it to show up in IDE
     * autocomplete, so we use a private Symbol instead.
     */
    [RefSymbol]: true;
    /**
     * @internal
     */
    dep?: Dep;
    /**
     * @internal
     */
    [RefFlag]: true;
}
export declare function isRef<T>(r: Ref<T> | unknown): r is Ref<T>;
export declare function ref<T extends Ref>(value: T): T;
export declare function ref<T>(value: T): Ref<UnwrapRef<T>>;
export declare function ref<T = any>(): Ref<T | undefined>;
declare const ShallowRefMarker: unique symbol;
export type ShallowRef<T = any> = Ref<T> & {
    [ShallowRefMarker]?: true;
};
export declare function shallowRef<T>(value: T | Ref<T>): Ref<T> | ShallowRef<T>;
export declare function shallowRef<T extends Ref>(value: T): T;
export declare function shallowRef<T>(value: T): ShallowRef<T>;
export declare function shallowRef<T = any>(): ShallowRef<T | undefined>;
export declare function triggerRef(ref: Ref): void;
export declare function unref<T>(ref: T | Ref<T>): T;
export declare function proxyRefs<T extends object>(objectWithRefs: T): ShallowUnwrapRef<T>;
export declare function proxyWithRefUnwrap(target: any, source: Record<string, any>, key: string): void;
export type CustomRefFactory<T> = (track: () => void, trigger: () => void) => {
    get: () => T;
    set: (value: T) => void;
};
export declare function customRef<T>(factory: CustomRefFactory<T>): Ref<T>;
export type ToRefs<T = any> = {
    [K in keyof T]: ToRef<T[K]>;
};
export declare function toRefs<T extends object>(object: T): ToRefs<T>;
export type ToRef<T> = IfAny<T, Ref<T>, [T] extends [Ref] ? T : Ref<T>>;
export declare function toRef<T extends object, K extends keyof T>(object: T, key: K): ToRef<T[K]>;
export declare function toRef<T extends object, K extends keyof T>(object: T, key: K, defaultValue: T[K]): ToRef<Exclude<T[K], undefined>>;
/**
 * This is a special exported interface for other packages to declare
 * additional types that should bail out for ref unwrapping. For example
 * \@vue/runtime-dom can declare it like so in its d.ts:
 *
 * ``` ts
 * declare module 'vue' {
 *   export interface RefUnwrapBailTypes {
 *     runtimeDOMBailTypes: Node | Window
 *   }
 * }
 * ```
 *
 * Note that api-extractor somehow refuses to include `declare module`
 * augmentations in its generated d.ts, so we have to manually append them
 * to the final generated d.ts in our build process.
 */
export interface RefUnwrapBailTypes {
    runtimeDOMBailTypes: Node | Window;
}
export type ShallowUnwrapRef<T> = {
    [K in keyof T]: T[K] extends Ref<infer V> ? V : T[K] extends Ref<infer V> | undefined ? unknown extends V ? undefined : V | undefined : T[K];
};
export type UnwrapRef<T> = T extends ShallowRef<infer V> ? V : T extends Ref<infer V> ? UnwrapRefSimple<V> : UnwrapRefSimple<T>;
type BaseTypes = string | number | boolean;
type CollectionTypes = IterableCollections | WeakCollections;
type IterableCollections = Map<any, any> | Set<any>;
type WeakCollections = WeakMap<any, any> | WeakSet<any>;
export type UnwrapRefSimple<T> = T extends Function | CollectionTypes | BaseTypes | Ref | RefUnwrapBailTypes[keyof RefUnwrapBailTypes] | {
    [RawSymbol]?: true;
} ? T : T extends Array<any> ? {
    [K in keyof T]: UnwrapRefSimple<T[K]>;
} : T extends object & {
    [ShallowReactiveMarker]?: never;
} ? {
    [P in keyof T]: P extends symbol ? T[P] : UnwrapRef<T[P]>;
} : T;
export {};
