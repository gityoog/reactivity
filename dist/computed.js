"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computed = void 0;
const util_1 = require("./core/util");
const ref_1 = require("./ref");
const watcher_1 = __importDefault(require("./core/observer/watcher"));
const dep_1 = __importDefault(require("./core/observer/dep"));
const isDev_1 = require("./core/util/isDev");
function computed(getterOrOptions, debugOptions) {
    let getter;
    let setter;
    const onlyGetter = (0, util_1.isFunction)(getterOrOptions);
    if (onlyGetter) {
        getter = getterOrOptions;
        setter = (0, isDev_1.isDev)()
            ? () => {
                (0, util_1.warn)('Write operation failed: computed value is readonly');
            }
            : util_1.noop;
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    const watcher = (0, util_1.isServerRendering)()
        ? null
        : new watcher_1.default(null, getter, util_1.noop, { lazy: true });
    if ((0, isDev_1.isDev)() && watcher && debugOptions) {
        watcher.onTrack = debugOptions.onTrack;
        watcher.onTrigger = debugOptions.onTrigger;
    }
    const ref = {
        // some libs rely on the presence effect for checking computed refs
        // from normal refs, but the implementation doesn't matter
        effect: watcher,
        get value() {
            if (watcher) {
                if (watcher.dirty) {
                    watcher.evaluate();
                }
                if (dep_1.default.target) {
                    if ((0, isDev_1.isDev)() && dep_1.default.target.onTrack) {
                        dep_1.default.target.onTrack({
                            effect: dep_1.default.target,
                            target: ref,
                            type: "get" /* TrackOpTypes.GET */,
                            key: 'value'
                        });
                    }
                    watcher.depend();
                }
                return watcher.value;
            }
            else {
                return getter();
            }
        },
        set value(newVal) {
            setter(newVal);
        }
    };
    (0, util_1.def)(ref, ref_1.RefFlag, true);
    (0, util_1.def)(ref, "__v_isReadonly" /* ReactiveFlags.IS_READONLY */, onlyGetter);
    return ref;
}
exports.computed = computed;
