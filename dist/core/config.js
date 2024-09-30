"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../shared/util");
const constants_1 = require("../shared/constants");
const isDev_1 = require("./util/isDev");
exports.default = {
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),
    /**
     * Whether to suppress warnings.
     */
    silent: false,
    /**
     * Show production mode tip message on boot?
     */
    productionTip: (0, isDev_1.isDev)(),
    /**
     * Whether to enable devtools
     */
    devtools: (0, isDev_1.isDev)(),
    /**
     * Whether to record perf
     */
    performance: false,
    /**
     * Error handler for watcher errors
     */
    errorHandler: null,
    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,
    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],
    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),
    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: util_1.no,
    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: util_1.no,
    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: util_1.no,
    /**
     * Get the namespace of an element
     */
    getTagNamespace: util_1.noop,
    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: util_1.identity,
    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: util_1.no,
    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */
    async: true,
    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: constants_1.LIFECYCLE_HOOKS
};
