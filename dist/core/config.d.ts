import type { Component } from '../types/component';
/**
 * @internal
 */
export interface Config {
    optionMergeStrategies: {
        [key: string]: Function;
    };
    silent: boolean;
    productionTip: boolean;
    performance: boolean;
    devtools: boolean;
    errorHandler?: (err: Error, vm: Component | null, info: string) => void;
    warnHandler?: (msg: string, vm: Component | null, trace: string) => void;
    ignoredElements: Array<string | RegExp>;
    keyCodes: {
        [key: string]: number | Array<number>;
    };
    isReservedTag: (x: string) => boolean | undefined;
    isReservedAttr: (x: string) => true | undefined;
    parsePlatformTagName: (x: string) => string;
    isUnknownElement: (x: string) => boolean;
    getTagNamespace: (x: string) => string | undefined;
    mustUseProp: (tag: string, type?: string | null, name?: string) => boolean;
    async: boolean;
    _lifecycleHooks: Array<string>;
}
declare const _default: Config;
export default _default;
