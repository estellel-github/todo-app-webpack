import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

class TaskManager {
  constructor() {
    this._tasks = [];
  }

  addTask(task, projectId, projectCatalog) {
    task.id = this._tasks.length + 1;
    this._tasks.push(task);
    const project = projectCatalog.findProjectById(projectId);
    if (project) {
      project.addTask(task);
    }
  }

  deleteTask(taskId, projectId, projectCatalog) {
    const project = projectCatalog.findProjectById(projectId);
    if (project) {
      project.deleteTask(taskId);
    }
  }

  moveTask(taskId, fromProjectId, toProjectId, projectManager) {
    const fromProject = projectManager.findProjectById(fromProjectId);
    const toProject = projectManager.findProjectById(toProjectId);
    const task = fromProject.getTask(taskId);
    if (task && fromProject && toProject) {
      fromProject.deleteTask(taskId);
      task.project = toProject.name;
      toProject.addTask(task);
    }
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

}

export { TaskManager };