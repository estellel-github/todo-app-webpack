import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

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
    let task = this._tasks.find((task) => task.id === taskId);
    task = updatedTask;
  }

  moveTask(taskId, targetProjectId) {
    let task = this._tasks.find((task) => task.id === taskId);
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
    const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });
    return this._tasks.filter((task) =>
      isWithinInterval(new Date(task.dueDate), {
        start: startOfThisWeek,
        end: endOfThisWeek,
      })
    );
  }

  getTasksByProject(projectId) {
    return this._tasks.filter((task) => task.projectId === projectId);
  }

  getNumTasksByProject(projectId) {
    return this.getTasksByProject(projectId).length;
  }
}

export { TaskManager };
