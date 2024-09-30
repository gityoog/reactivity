"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measure = exports.mark = void 0;
const env_1 = require("./env");
const isDev_1 = require("./isDev");
if ((0, isDev_1.isDev)()) {
    const perf = env_1.inBrowser && window.performance;
    /* istanbul ignore if */
    if (perf &&
        // @ts-ignore
        perf.mark &&
        // @ts-ignore
        perf.measure &&
        // @ts-ignore
        perf.clearMarks &&
        // @ts-ignore
        perf.clearMeasures) {
        exports.mark = tag => perf.mark(tag);
        exports.measure = (name, startTag, endTag) => {
            perf.measure(name, startTag, endTag);
            perf.clearMarks(startTag);
            perf.clearMarks(endTag);
            // perf.clearMeasures(name)
        };
    }
}
