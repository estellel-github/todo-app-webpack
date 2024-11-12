import { Task } from "./Task";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

class TaskManager {

  #tasks: Task[];

  constructor() {
    this.#tasks = [];
  }

  addTask(task: Task): void {
    this.#tasks.push(task);
  }

  deleteTask(taskId: number): void {
    this.#tasks = this.#tasks.filter((task) => task.id !== taskId);
  }

  deleteAllTasksInProject(projectId: number): void {
    this.#tasks = this.#tasks.filter((task) => task.projectId !== projectId);
  }

  getTask(taskId: number): Task {
    return this.#tasks.find((task) => task.id === taskId);
  }

  updateTask(taskId: number, updatedTask: Task): void {
    let taskIndex = this.#tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      this.#tasks[taskIndex] = updatedTask;
    }
  }

  moveTask(taskId: number, targetProjectId: number): void {
    let task = this.#tasks.find((task) => task.id === taskId);
    if (task) task.projectId = targetProjectId;
  }

  getAllTasks(): Task[] {
    return this.#tasks;
  }

  getTasksDueToday(): Task[] {
    const today = new Date().toDateString();
    return this.#tasks.filter((task) => task.dueDate.toDateString() === today);
  }

  getTasksDueThisWeek(): Task[] {
    const now = new Date();
    const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });
    return this.#tasks.filter((task) =>
      isWithinInterval(new Date(task.dueDate), {
        start: startOfThisWeek,
        end: endOfThisWeek,
      })
    );
  }

  getTasksByProject(projectId: number): Task[] {
    return this.#tasks.filter((task) => task.projectId === projectId);
  }

  getNumTasksByProject(projectId: number): number {
    return this.getTasksByProject(projectId).length;
  }
}

export { TaskManager };
