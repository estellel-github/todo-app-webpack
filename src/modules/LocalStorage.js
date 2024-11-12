"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROJECTS_STORAGE_KEY = exports.TASKS_STORAGE_KEY = void 0;
exports.storeTasksToLocal = storeTasksToLocal;
exports.storeProjectsToLocal = storeProjectsToLocal;
exports.retrieveLocalTasks = retrieveLocalTasks;
exports.retrieveLocalProjects = retrieveLocalProjects;
const Task_1 = require("./Task");
const Project_1 = require("./Project");
const TASKS_STORAGE_KEY = "TO DO App - Tasks";
exports.TASKS_STORAGE_KEY = TASKS_STORAGE_KEY;
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
        storedTasks = tempTasks.map((taskData) => {
            const taskDetails = Object.assign(Object.assign({}, taskData), { dueDate: new Date(taskData.dueDate) });
            return new Task_1.Task(taskDetails);
        });
        console.log("Tasks found in storage:");
        console.table(storedTasks);
    }
    else {
        console.log("No tasks found in Local Storage.");
    }
    return storedTasks;
}
const PROJECTS_STORAGE_KEY = "TO DO App - Projects";
exports.PROJECTS_STORAGE_KEY = PROJECTS_STORAGE_KEY;
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
            .filter((project) => project.id !== 1)
            .map((projectData) => new Project_1.Project(projectData));
        console.log("Projects retrieved from Local Storage:", storedProjects);
    }
    else {
        console.log("No projects found in Local Storage.");
    }
    return storedProjects;
}
