import type { Component } from '../../types/component';
/**
 * Data
 */
export declare function mergeDataOrFn(parentVal: any, childVal: any, vm?: Component): Function | null;
/**
 * Hooks and props are merged as arrays.
 */
export declare function mergeLifecycleHook(parentVal: Array<Function> | null, childVal: Function | Array<Function> | null): Array<Function> | null;
export declare function validateComponentName(name: string): void;
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export declare function resolveAsset(options: Record<string, any>, type: string, id: string, warnMissing?: boolean): any;
