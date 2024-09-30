export declare const emptyObject: Record<string, any>;
export declare const isArray: (arg: any) => arg is any[];
export declare function isUndef(v: any): v is undefined | null;
export declare function isDef<T>(v: T): v is NonNullable<T>;
export declare function isTrue(v: any): boolean;
export declare function isFalse(v: any): boolean;
/**
 * Check if value is primitive.
 */
export declare function isPrimitive(value: any): boolean;
export declare function isFunction(value: any): value is (...args: any[]) => any;
/**
 * Quick object check - this is primarily used to tell
 * objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export declare function isObject(obj: any): boolean;
export declare function toRawType(value: any): string;
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export declare function isPlainObject(obj: any): boolean;
export declare function isRegExp(v: any): v is RegExp;
/**
 * Check if val is a valid array index.
 */
export declare function isValidArrayIndex(val: any): boolean;
export declare function isPromise(val: any): val is Promise<any>;
/**
 * Convert a value to a string that is actually rendered.
 */
export declare function toString(val: any): string;
/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
export declare function toNumber(val: string): number | string;
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
export declare function makeMap(str: string, expectsLowerCase?: boolean): (key: string) => true | undefined;
/**
 * Check if a tag is a built-in tag.
 */
export declare const isBuiltInTag: (key: string) => true | undefined;
/**
 * Check if an attribute is a reserved attribute.
 */
export declare const isReservedAttribute: (key: string) => true | undefined;
/**
 * Remove an item from an array.
 */
export declare function remove(arr: Array<any>, item: any): Array<any> | void;
export declare function hasOwn(obj: Object | Array<any>, key: string): boolean;
/**
 * Create a cached version of a pure function.
 */
export declare function cached<R>(fn: (str: string) => R): (sr: string) => R;
export declare const camelize: (sr: string) => string;
/**
 * Capitalize a string.
 */
export declare const capitalize: (sr: string) => string;
export declare const hyphenate: (sr: string) => string;
declare function nativeBind(fn: Function, ctx: Object): Function;
export declare const bind: typeof nativeBind;
/**
 * Convert an Array-like object to a real Array.
 */
export declare function toArray(list: any, start?: number): Array<any>;
/**
 * Mix properties into target object.
 */
export declare function extend(to: Record<PropertyKey, any>, _from?: Record<PropertyKey, any>): Record<PropertyKey, any>;
/**
 * Merge an Array of Objects into a single Object.
 */
export declare function toObject(arr: Array<any>): object;
/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
export declare function noop(a?: any, b?: any, c?: any): void;
/**
 * Always return false.
 */
export declare const no: (a?: any, b?: any, c?: any) => boolean;
/**
 * Return the same value.
 */
export declare const identity: (_: any) => any;
/**
 * Generate a string containing static keys from compiler modules.
 */
export declare function genStaticKeys(modules: Array<{
    staticKeys?: string[];
}>): string;
/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
export declare function looseEqual(a: any, b: any): boolean;
/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
export declare function looseIndexOf(arr: Array<unknown>, val: unknown): number;
/**
 * Ensure a function is called only once.
 */
export declare function once<T extends (...args: any[]) => any>(fn: T): T;
export declare function hasChanged(x: unknown, y: unknown): boolean;
export {};
