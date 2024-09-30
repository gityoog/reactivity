"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIFECYCLE_HOOKS = exports.ASSET_TYPES = exports.SSR_ATTR = void 0;
exports.SSR_ATTR = 'data-server-rendered';
exports.ASSET_TYPES = ['component', 'directive', 'filter'];
exports.LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch',
    'renderTracked',
    'renderTriggered'
];
