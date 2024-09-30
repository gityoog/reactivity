import { Ref } from './ref';
import { DebuggerOptions } from './debug';
declare const ComputedRefSymbol: unique symbol;
export interface ComputedRef<T = any> extends WritableComputedRef<T> {
    readonly value: T;
    [ComputedRefSymbol]: true;
}
export interface WritableComputedRef<T> extends Ref<T> {
    readonly effect: any;
}
export type ComputedGetter<T> = (...args: any[]) => T;
export type ComputedSetter<T> = (v: T) => void;
export interface WritableComputedOptions<T> {
    get: ComputedGetter<T>;
    set: ComputedSetter<T>;
}
export declare function computed<T>(getter: ComputedGetter<T>, debugOptions?: DebuggerOptions): ComputedRef<T>;
export declare function computed<T>(options: WritableComputedOptions<T>, debugOptions?: DebuggerOptions): WritableComputedRef<T>;
export {};
