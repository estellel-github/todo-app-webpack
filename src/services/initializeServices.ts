import { projectService } from "../services/ProjectService";
import { taskService } from "../services/TaskService";
import { Task } from "../types/TaskTypes";
import {
  retrieveLocalTasks,
  retrieveLocalProjects,
} from "../services/LocalStorage";
import { seedLocalStorage } from "../utils/seedLocalStorage"
import { ProjectDetails, TaskDetails } from '../types/AppTypes';
import { INBOX_ID, INBOX_NAME } from "../utils/constants";

seedLocalStorage();

const listProjects = () => {
  projectService.addProject({ id: INBOX_ID, name: INBOX_NAME });
  let storedProjectArray = retrieveLocalProjects();
  if (storedProjectArray && storedProjectArray.length > 0) {
    storedProjectArray.forEach((projectData: ProjectDetails) => {
      projectService.addProject({ id: projectData.id, name: projectData.name });
    });
  }
  console.table(projectService);
};

const listTasks = () => {
  let storedTaskArray = retrieveLocalTasks();
  storedTaskArray.forEach((taskData: TaskDetails) => {
    const task = new Task({
      id: taskData.id,
      projectId: taskData.projectId,
      status: taskData.status,
      title: taskData.title,
      dueDate: new Date(taskData.dueDate),
      priority: taskData.priority,
      notes: taskData.notes
    }
    );
    taskService.addTask(task);
  });
  console.table(taskService.getAllTasks());
};

export const initializeServices = (): void => {
  listProjects();
  listTasks();
}