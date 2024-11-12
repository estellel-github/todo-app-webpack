"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const generateId_1 = require("./generateId");
class Task {
    constructor(taskDetails) {
        this._id = taskDetails.id || (0, generateId_1.generateId)();
        this._projectId = taskDetails.projectId;
        this._status = taskDetails.status;
        this._title = taskDetails.title;
        this._dueDate = taskDetails.dueDate;
        this._priority = taskDetails.priority;
        this._notes = taskDetails.notes;
    }
    get id() {
        return this._id;
    }
    get projectId() {
        return this._projectId;
    }
    set projectId(projectId) {
        this._projectId = projectId;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }
    get dueDate() {
        return this._dueDate;
    }
    set dueDate(value) {
        this._dueDate = value;
    }
    get priority() {
        return this._priority;
    }
    set priority(value) {
        this._priority = value;
    }
    get notes() {
        return this._notes;
    }
    set notes(value) {
        this._notes = value;
    }
}
exports.Task = Task;
