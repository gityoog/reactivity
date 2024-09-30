"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDev = exports.isDev = void 0;
let dev = true;
function isDev() {
    return dev;
}
exports.isDev = isDev;
function setDev(value = true) {
    dev = value;
}
exports.setDev = setDev;
