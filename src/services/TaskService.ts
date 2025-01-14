import { Task } from "../types/TaskTypes";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

class TaskService {

  private _tasks: Task[];

  constructor() {
    this._tasks = [];
  }

  addTask(task: Task): void {
    this._tasks.push(task);
  }

  deleteTask(taskId: number): void {
    this._tasks = this._tasks.filter((task) => task.id !== taskId);
  }

  deleteAllTasksInProject(projectId: number): void {
    this._tasks = this._tasks.filter((task) => task.projectId !== projectId);
  }

  getTask(taskId: number): Task | undefined {
    return this._tasks.find((task) => task.id === taskId);
  }

  updateTask(taskId: number, updatedTask: Task): void {
    let taskIndex = this._tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      this._tasks[taskIndex] = updatedTask;
    }
  }

  moveTask(taskId: number, targetProjectId: number): void {
    let task = this._tasks.find((task) => task.id === taskId);
    if (task) task.projectId = targetProjectId;
  }

  getAllTasks(): Task[] {
    return this._tasks;
  }

  getTasksDueToday(): Task[] {
    const today = new Date().toDateString();
    return this._tasks.filter((task) => task.dueDate.toDateString() === today);
  }

  getTasksDueThisWeek(): Task[] {
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

  getTasksByProject(projectId: number): Task[] {
    return this._tasks.filter((task) => task.projectId === projectId);
  }

  getNumTasksByProject(projectId: number): number {
    return this.getTasksByProject(projectId).length;
  }
}

export const taskService = new TaskService();
