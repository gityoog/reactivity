import type Watcher from './watcher';
export declare const MAX_UPDATE_COUNT = 100;
export declare let currentFlushTimestamp: number;
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export declare function queueWatcher(watcher: Watcher): void;
