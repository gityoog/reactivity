import Dep from './dep';
/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
export declare let shouldObserve: boolean;
export declare function toggleObserving(value: boolean): void;
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export declare class Observer {
    value: any;
    shallow: boolean;
    mock: boolean;
    dep: Dep;
    vmCount: number;
    constructor(value: any, shallow?: boolean, mock?: boolean);
    /**
     * Observe a list of Array items.
     */
    observeArray(value: any[]): void;
}
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export declare function observe(value: any, shallow?: boolean, ssrMockReactivity?: boolean): Observer | void;
/**
 * Define a reactive property on an Object.
 */
export declare function defineReactive(obj: object, key: string, val?: any, customSetter?: Function | null, shallow?: boolean, mock?: boolean, observeEvenIfShallow?: boolean): Dep | undefined;
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export declare function set<T>(array: T[], key: number, value: T): T;
export declare function set<T>(object: object, key: string | number, value: T): T;
/**
 * Delete a property and trigger change if necessary.
 */
export declare function del<T>(array: T[], key: number): void;
export declare function del(object: object, key: string | number): void;
