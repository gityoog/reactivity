export declare let isUsingMicroTask: boolean;
export declare function nextTick(): Promise<void>;
export declare function nextTick<T>(this: T, cb: (this: T, ...args: any[]) => any): void;
export declare function nextTick<T>(cb: (this: T, ...args: any[]) => any, ctx: T): void;
