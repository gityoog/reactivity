"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineReactive = void 0;
__exportStar(require("../../shared/util"), exports);
__exportStar(require("./lang"), exports);
__exportStar(require("./env"), exports);
__exportStar(require("./options"), exports);
__exportStar(require("./debug"), exports);
__exportStar(require("./error"), exports);
__exportStar(require("./next-tick"), exports);
var index_1 = require("../observer/index");
Object.defineProperty(exports, "defineReactive", { enumerable: true, get: function () { return index_1.defineReactive; } });
