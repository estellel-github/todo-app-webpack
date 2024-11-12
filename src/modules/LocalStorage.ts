import { Task } from "./Task";
import { Project } from "./Project";
import { TaskDetails, ProjectDetails } from "./types";

const TASKS_STORAGE_KEY: string = "TO DO App - Tasks";

function storeTasksToLocal(localTasks: Task[]) {
  const taskData = localTasks.map(task => ({
    id: task.id,
    projectId: task.projectId,
    status: task.status,
    title: task.title,
    dueDate: task.dueDate,
    priority: task.priority,
    notes: task.notes
  }));
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(taskData));
  console.log("Tasks stored to local storage:", JSON.stringify(taskData));
}

function retrieveLocalTasks(): Task[] {
  const storedCatalogJson = localStorage.getItem(TASKS_STORAGE_KEY);
  let storedTasks = [];
  if (storedCatalogJson && storedCatalogJson.length !== 0) {
    const tempTasks = JSON.parse(storedCatalogJson);
    storedTasks = tempTasks.map(
      (taskData: Omit<TaskDetails, "dueDate"> & { dueDate: string }) => {
        const taskDetails = { ...taskData, dueDate: new Date(taskData.dueDate) };
        return new Task(taskDetails);
      }
    );
    console.log("Tasks found in storage:");
    console.table(storedTasks);
  } else {
    console.log("No tasks found in Local Storage.");
  }
  return storedTasks;
}

const PROJECTS_STORAGE_KEY: string = "TO DO App - Projects";

function storeProjectsToLocal(localProjects: Project[]) {
  console.log(localProjects);
  const projectData = localProjects.map((project) => ({
    id: project.id,
    name: project.name,
  }));
  const projectCatalogJson = JSON.stringify(projectData);
  localStorage.setItem(PROJECTS_STORAGE_KEY, projectCatalogJson);
  console.log("Projects stored in Local Storage:", projectCatalogJson);
}

function retrieveLocalProjects(): Project[] {
  const storedCatalogJson = localStorage.getItem(PROJECTS_STORAGE_KEY);
  let storedProjects: Project[] = [];
  if (storedCatalogJson && storedCatalogJson.length !== 0) {
    const tempProjects = JSON.parse(storedCatalogJson);
    storedProjects = tempProjects
      .filter((project: Project) => project.id !== 1)
      .map((projectData: ProjectDetails) =>
        new Project(projectData)
      );
    console.log("Projects retrieved from Local Storage:", storedProjects);
  } else {
    console.log("No projects found in Local Storage.");
  }
  return storedProjects;
}

export {
  storeTasksToLocal,
  storeProjectsToLocal,
  retrieveLocalTasks,
  retrieveLocalProjects,
  TASKS_STORAGE_KEY,
  PROJECTS_STORAGE_KEY,
};
