import { DebuggerOptions, DebuggerEventExtraInfo } from '../../debug';
export declare const cleanupDeps: () => void;
/**
 * @internal
 */
export interface DepTarget extends DebuggerOptions {
    id: number;
    addDep(dep: Dep): void;
    update(): void;
}
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * @internal
 */
export default class Dep {
    static target?: DepTarget | null;
    id: number;
    subs: Array<DepTarget | null>;
    _pending: boolean;
    constructor();
    addSub(sub: DepTarget): void;
    removeSub(sub: DepTarget): void;
    depend(info?: DebuggerEventExtraInfo): void;
    notify(info?: DebuggerEventExtraInfo): void;
}
export declare function pushTarget(target?: DepTarget | null): void;
export declare function popTarget(): void;
