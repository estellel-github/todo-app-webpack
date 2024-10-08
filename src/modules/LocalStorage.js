import { Task } from "./Task";
import { Project } from "./Project";

const TASKS_STORAGE_KEY = "TO DO App - Tasks";

function storeTasksToLocal(localTasks) {
  const taskCatalogJson = JSON.stringify(localTasks);
  console.log("Tasks stored to local storage:" + taskCatalogJson);
  localStorage.setItem(TASKS_STORAGE_KEY, taskCatalogJson);
}

function retrieveLocalTasks() {
  const storedCatalogJson = localStorage.getItem(TASKS_STORAGE_KEY);
  let storedTasks = [];
  if (storedCatalogJson && storedCatalogJson.length !== 0) {
    const tempTasks = JSON.parse(storedCatalogJson);
    storedTasks = tempTasks.map(
      (taskData) =>
        new Task(
          taskData._id,
          taskData._projectId,
          taskData._status,
          taskData._title,
          new Date(taskData._dueDate),
          taskData._priority,
          taskData._notes
        )
    );
    console.log("Tasks found in storage:");
    console.table(storedTasks);
  } else {
    console.log("No tasks found in Local Storage.");
  }
  return storedTasks;
}

const PROJECTS_STORAGE_KEY = "TO DO App - Projects";

function storeProjectsToLocal(localProjects) {
  console.log(localProjects);
  const projectCatalogJson = JSON.stringify(localProjects);
  localStorage.setItem(PROJECTS_STORAGE_KEY, projectCatalogJson);
  console.log("Projects stored in Local Storage:", projectCatalogJson);
}

function retrieveLocalProjects() {
  const storedCatalogJson = localStorage.getItem(PROJECTS_STORAGE_KEY);
  let storedProjects = [];
  if (storedCatalogJson && storedCatalogJson.length !== 0) {
    const tempProjects = JSON.parse(storedCatalogJson);
    storedProjects = tempProjects
      .filter((project) => project._id !== 1)
      .map((projectData) => new Project(projectData._id, projectData._name));
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
