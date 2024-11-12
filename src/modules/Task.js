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
var _Task_id, _Task_projectId, _Task_status, _Task_title, _Task_dueDate, _Task_priority, _Task_notes;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const generateId_1 = require("./generateId");
class Task {
    constructor(taskDetails) {
        _Task_id.set(this, void 0);
        _Task_projectId.set(this, void 0);
        _Task_status.set(this, void 0);
        _Task_title.set(this, void 0);
        _Task_dueDate.set(this, void 0);
        _Task_priority.set(this, void 0);
        _Task_notes.set(this, void 0);
        __classPrivateFieldSet(this, _Task_id, taskDetails.id || (0, generateId_1.generateId)(), "f");
        __classPrivateFieldSet(this, _Task_projectId, taskDetails.projectId, "f");
        __classPrivateFieldSet(this, _Task_status, taskDetails.status, "f");
        __classPrivateFieldSet(this, _Task_title, taskDetails.title, "f");
        __classPrivateFieldSet(this, _Task_dueDate, taskDetails.dueDate, "f");
        __classPrivateFieldSet(this, _Task_priority, taskDetails.priority, "f");
        __classPrivateFieldSet(this, _Task_notes, taskDetails.notes, "f");
    }
    get id() {
        return __classPrivateFieldGet(this, _Task_id, "f");
    }
    get projectId() {
        return __classPrivateFieldGet(this, _Task_projectId, "f");
    }
    set projectId(projectId) {
        __classPrivateFieldSet(this, _Task_projectId, projectId, "f");
    }
    get status() {
        return __classPrivateFieldGet(this, _Task_status, "f");
    }
    set status(value) {
        __classPrivateFieldSet(this, _Task_status, value, "f");
    }
    get title() {
        return __classPrivateFieldGet(this, _Task_title, "f");
    }
    set title(value) {
        __classPrivateFieldSet(this, _Task_title, value, "f");
    }
    get dueDate() {
        return __classPrivateFieldGet(this, _Task_dueDate, "f");
    }
    set dueDate(value) {
        __classPrivateFieldSet(this, _Task_dueDate, value, "f");
    }
    get priority() {
        return __classPrivateFieldGet(this, _Task_priority, "f");
    }
    set priority(value) {
        __classPrivateFieldSet(this, _Task_priority, value, "f");
    }
    get notes() {
        return __classPrivateFieldGet(this, _Task_notes, "f");
    }
    set notes(value) {
        __classPrivateFieldSet(this, _Task_notes, value, "f");
    }
}
exports.Task = Task;
_Task_id = new WeakMap(), _Task_projectId = new WeakMap(), _Task_status = new WeakMap(), _Task_title = new WeakMap(), _Task_dueDate = new WeakMap(), _Task_priority = new WeakMap(), _Task_notes = new WeakMap();
