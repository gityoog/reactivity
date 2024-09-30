"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.effect = void 0;
const watcher_1 = __importDefault(require("./core/observer/watcher"));
const util_1 = require("./shared/util");
// export type EffectScheduler = (...args: any[]) => any
/**
 * @internal since we are not exposing this in Vue 2, it's used only for
 * internal testing.
 */
function effect(fn, scheduler) {
    const watcher = new watcher_1.default(null, fn, util_1.noop, {
        sync: true
    });
    if (scheduler) {
        watcher.update = () => {
            scheduler(() => watcher.run());
        };
    }
}
exports.effect = effect;
