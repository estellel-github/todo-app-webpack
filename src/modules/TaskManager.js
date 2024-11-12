"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
const date_fns_1 = require("date-fns");
class TaskManager {
    constructor() {
        this._tasks = [];
    }
    addTask(task) {
        this._tasks.push(task);
    }
    deleteTask(taskId) {
        this._tasks = this._tasks.filter((task) => task.id !== taskId);
    }
    deleteAllTasksInProject(projectId) {
        this._tasks = this._tasks.filter((task) => task.projectId !== projectId);
    }
    getTask(taskId) {
        return this._tasks.find((task) => task.id === taskId);
    }
    updateTask(taskId, updatedTask) {
        let taskIndex = this._tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            this._tasks[taskIndex] = updatedTask;
        }
    }
    moveTask(taskId, targetProjectId) {
        let task = this._tasks.find((task) => task.id === taskId);
        if (task)
            task.projectId = targetProjectId;
    }
    getAllTasks() {
        return this._tasks;
    }
    getTasksDueToday() {
        const today = new Date().toDateString();
        return this._tasks.filter((task) => task.dueDate.toDateString() === today);
    }
    getTasksDueThisWeek() {
        const now = new Date();
        const startOfThisWeek = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 });
        const endOfThisWeek = (0, date_fns_1.endOfWeek)(now, { weekStartsOn: 1 });
        return this._tasks.filter((task) => (0, date_fns_1.isWithinInterval)(new Date(task.dueDate), {
            start: startOfThisWeek,
            end: endOfThisWeek,
        }));
    }
    getTasksByProject(projectId) {
        return this._tasks.filter((task) => task.projectId === projectId);
    }
    getNumTasksByProject(projectId) {
        return this.getTasksByProject(projectId).length;
    }
}
exports.TaskManager = TaskManager;
