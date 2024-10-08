"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._Set = exports.hasSymbol = exports.isNative = exports.devtools = exports.isServerRendering = exports.supportsPassive = exports.nativeWatch = exports.isFF = exports.isPhantomJS = exports.isChrome = exports.isIOS = exports.isAndroid = exports.isEdge = exports.isIE9 = exports.isIE = exports.UA = exports.inBrowser = exports.hasProto = void 0;
// can we use __proto__?
exports.hasProto = '__proto__' in {};
// Browser environment sniffing
exports.inBrowser = typeof window !== 'undefined';
exports.UA = exports.inBrowser && window.navigator.userAgent.toLowerCase();
exports.isIE = exports.UA && /msie|trident/.test(exports.UA);
exports.isIE9 = exports.UA && exports.UA.indexOf('msie 9.0') > 0;
exports.isEdge = exports.UA && exports.UA.indexOf('edge/') > 0;
exports.isAndroid = exports.UA && exports.UA.indexOf('android') > 0;
exports.isIOS = exports.UA && /iphone|ipad|ipod|ios/.test(exports.UA);
exports.isChrome = exports.UA && /chrome\/\d+/.test(exports.UA) && !exports.isEdge;
exports.isPhantomJS = exports.UA && /phantomjs/.test(exports.UA);
exports.isFF = exports.UA && exports.UA.match(/firefox\/(\d+)/);
// Firefox has a "watch" function on Object.prototype...
// @ts-expect-error firebox support
exports.nativeWatch = {}.watch;
exports.supportsPassive = false;
if (exports.inBrowser) {
    try {
        const opts = {};
        Object.defineProperty(opts, 'passive', {
            get() {
                /* istanbul ignore next */
                exports.supportsPassive = true;
            }
        }); // https://github.com/facebook/flow/issues/285
        window.addEventListener('test-passive', null, opts);
    }
    catch (e) { }
}
// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
let _isServer;
const isServerRendering = () => {
    if (_isServer === undefined) {
        /* istanbul ignore if */
        if (!exports.inBrowser && typeof global !== 'undefined') {
            // detect presence of vue-server-renderer and avoid
            // Webpack shimming the process
            _isServer =
                global['process'] && global['process'].env.VUE_ENV === 'server';
        }
        else {
            _isServer = false;
        }
    }
    return _isServer;
};
exports.isServerRendering = isServerRendering;
// detect devtools
exports.devtools = exports.inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
/* istanbul ignore next */
function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}
exports.isNative = isNative;
exports.hasSymbol = typeof Symbol !== 'undefined' &&
    isNative(Symbol) &&
    typeof Reflect !== 'undefined' &&
    isNative(Reflect.ownKeys);
let _Set; // $flow-disable-line
/* istanbul ignore if */ if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    exports._Set = _Set = Set;
}
else {
    // a non-standard Set polyfill that only works with primitive keys.
    exports._Set = _Set = class Set {
        constructor() {
            this.set = Object.create(null);
        }
        has(key) {
            return this.set[key] === true;
        }
        add(key) {
            this.set[key] = true;
        }
        clear() {
            this.set = Object.create(null);
        }
    };
}
