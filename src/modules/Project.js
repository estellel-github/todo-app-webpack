"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Project_id, _Project_name;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const generateId_1 = require("./generateId");
class Project {
    constructor(projectDetails) {
        _Project_id.set(this, void 0);
        _Project_name.set(this, void 0);
        __classPrivateFieldSet(this, _Project_id, projectDetails.id || (0, generateId_1.generateId)(), "f");
        __classPrivateFieldSet(this, _Project_name, projectDetails.name, "f");
    }
    get id() {
        return __classPrivateFieldGet(this, _Project_id, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _Project_name, "f");
    }
    set name(value) {
        __classPrivateFieldSet(this, _Project_name, value, "f");
    }
}
exports.Project = Project;
_Project_id = new WeakMap(), _Project_name = new WeakMap();
