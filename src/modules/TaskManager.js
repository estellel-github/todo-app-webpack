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
var _TaskManager_tasks;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
const date_fns_1 = require("date-fns");
class TaskManager {
    constructor() {
        _TaskManager_tasks.set(this, void 0);
        __classPrivateFieldSet(this, _TaskManager_tasks, [], "f");
    }
    addTask(task) {
        __classPrivateFieldGet(this, _TaskManager_tasks, "f").push(task);
    }
    deleteTask(taskId) {
        __classPrivateFieldSet(this, _TaskManager_tasks, __classPrivateFieldGet(this, _TaskManager_tasks, "f").filter((task) => task.id !== taskId), "f");
    }
    deleteAllTasksInProject(projectId) {
        __classPrivateFieldSet(this, _TaskManager_tasks, __classPrivateFieldGet(this, _TaskManager_tasks, "f").filter((task) => task.projectId !== projectId), "f");
    }
    getTask(taskId) {
        return __classPrivateFieldGet(this, _TaskManager_tasks, "f").find((task) => task.id === taskId);
    }
    updateTask(taskId, updatedTask) {
        let taskIndex = __classPrivateFieldGet(this, _TaskManager_tasks, "f").findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            __classPrivateFieldGet(this, _TaskManager_tasks, "f")[taskIndex] = updatedTask;
        }
    }
    moveTask(taskId, targetProjectId) {
        let task = __classPrivateFieldGet(this, _TaskManager_tasks, "f").find((task) => task.id === taskId);
        if (task)
            task.projectId = targetProjectId;
    }
    getAllTasks() {
        return __classPrivateFieldGet(this, _TaskManager_tasks, "f");
    }
    getTasksDueToday() {
        const today = new Date().toDateString();
        return __classPrivateFieldGet(this, _TaskManager_tasks, "f").filter((task) => task.dueDate.toDateString() === today);
    }
    getTasksDueThisWeek() {
        const now = new Date();
        const startOfThisWeek = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 });
        const endOfThisWeek = (0, date_fns_1.endOfWeek)(now, { weekStartsOn: 1 });
        return __classPrivateFieldGet(this, _TaskManager_tasks, "f").filter((task) => (0, date_fns_1.isWithinInterval)(new Date(task.dueDate), {
            start: startOfThisWeek,
            end: endOfThisWeek,
        }));
    }
    getTasksByProject(projectId) {
        return __classPrivateFieldGet(this, _TaskManager_tasks, "f").filter((task) => task.projectId === projectId);
    }
    getNumTasksByProject(projectId) {
        return this.getTasksByProject(projectId).length;
    }
}
exports.TaskManager = TaskManager;
_TaskManager_tasks = new WeakMap();
