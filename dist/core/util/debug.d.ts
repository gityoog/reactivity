import { noop } from '../../shared/util';
import type { Component } from '../../types/component';
export declare let warn: (msg: string, vm?: Component | null) => void;
export declare let tip: typeof noop;
