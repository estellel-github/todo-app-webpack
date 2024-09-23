import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { generateTaskId } from "./generateTaskId";

class TaskManager {

  constructor() {
    this._tasks = [];
  }

  addTask(task) {
    task.id = generateTaskId();
    this._tasks.push(task);
  }

  deleteTask(taskId) {
    this._tasks = this._tasks.filter(task => task.id !== taskId);
  }

  moveTask(taskId, targetProjectId) {
    const task = getTask(taskId);
    task.projectId = targetProjectId;
  }

  getAllTasks() {
    return this._tasks;
  }

  getTask(taskId) {
    return this._tasks.filter(task => task.id === taskId);
  }

  getTasksDueToday() {
    const today = new Date().toDateString();
    return this._tasks.filter(task => task.dueDate.toDateString() === today);
  }

  getTasksDueThisWeek() {
    const now = new Date();
    const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });
    return this._tasks.filter(task => isWithinInterval(new Date(task.dueDate), { start: startOfThisWeek, end: endOfThisWeek }));
  }

  getTasksByProject(projectId) {
    return this._tasks.filter(task =>
      task.projectId === projectId);
  }

  getNumTasksByProject(projectId) {
    return this.getTasksByProject(projectId).length;
  }

}

export { TaskManager };