import { Project } from "./Project";
import { Task } from "./Task";
import { ProjectManager } from "./ProjectManager";
import { TaskManager } from "./TaskManager";
import { LocalStorage } from "./LocalStorage";
import { generateTaskId } from "./generateTaskId";

const moduleContentDiv = document.querySelector("#module-content");

const sidebar = document.createElement("div");
sidebar.className  = "sidebar";

const projectListDiv = document.createElement("div");
projectListDiv.className = "project-list";

const mainContainer = document.createElement("div");
mainContainer.className = "main-container";

const taskListDiv = document.createElement("div");
taskListDiv.className = "task-list";

const projectManager = new ProjectManager;
const taskManager = new TaskManager;

const testProjectArray = ["Work", "Home", "Hobbies", "Learning"];
const testTaskArray = [
  new Task(generateTaskId(), 0, "Active", "Check Email", "Check and sort inbox", new Date(), "Medium", "Keep inbox at zero", []),
  new Task(generateTaskId(), 1, "Active", "Prepare Presentation", "Slides for next week's meeting", new Date(), "High", "Include all recent data", []),
  new Task(generateTaskId(), 2, "Active", "Paint Living Room", "Choose spring color palette", new Date(), "Medium", "Sample colors this weekend", []),
  new Task(generateTaskId(), 3, "Active", "Knit a Scarf", "Finish knitting the blue scarf", new Date(), "Low", "Gift for mom's birthday", []),
  new Task(generateTaskId(), 4, "Active", "Study Spanish", "Complete Duolingo lessons", new Date(), "Medium", "30 mins practice daily", []),
  new Task(generateTaskId(), 1, "Active", "Team Meeting", "Weekly sync-up", new Date(), "High", "Discuss project updates", []),
  new Task(generateTaskId(), 2, "Active", "Repair Kitchen Sink", "Fix the leaking pipe", new Date(), "High", "Call the plumber", []),
  new Task(generateTaskId(), 3, "Active", "Read Photography Book", "Read chapter 4", new Date(), "Low", "Prepare for weekend photography", []),
  new Task(generateTaskId(), 4, "Active", "Research Marketing Courses", "Find suitable online course to enroll", new Date(), "High", "Check course reviews", []),
  new Task(generateTaskId(), 0, "Active", "Morning Routine", "Morning meditation and breakfast", new Date(), "Low", "Important for a good start", [])
];

const Projects = (() => {
  projectManager.createInbox();
  for (let i = 0; i < testProjectArray.length; i++) {
    projectManager.addProject(testProjectArray[i]);
  }
  console.table(projectManager);
})();

const Tasks = (() => {
  for (let i = 0; i < testTaskArray.length; i++) {
    taskManager.addTask(testTaskArray[i]);
  }
  console.table(taskManager);
})();

const clearProjectList = () => {
  projectListDiv.textContent = "";
};

const loadPage = (() => {
  moduleContentDiv.append(sidebar);
  moduleContentDiv.append(mainContainer);
})();

const displayProjectList = (() => {
  clearProjectList();
  projectManager.projects.forEach((project) => { 
    const projectItem = document.createElement("div");
    projectItem.className = "project-item";
    projectItem.textContent = project.name  + " (" + taskManager.getNumTasksByProject(project.id) + ")";
    projectListDiv.append(projectItem);
    sidebar.append(projectListDiv);
  }
  )
})();

function clearTaskList() {
  taskListDiv.textContent = "";
}

const displayTasks = ((tasks) => {
  clearTaskList();
  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.textContent = task.title;
    console.log(task.title);
    taskListDiv.append(taskItem);
    mainContainer.append(taskListDiv);
  })
});

// ALL
const listInboxTasks = ( () => {
  displayTasks(taskManager.getTasksByProject(0));
})();

// PER PROJECT
const listTasksInProject = ((projectId) => {
  displayTasks(taskManager.getTasksByProject(projectId));
});

// TODAY
const listTasksDueToday = (() => {
  displayTasks(taskManager.getTasksDueToday());
});

// THIS WEEK
const listTasksDueThisWeek = (() => {
  displayTasks(taskManager.getTasksDueThisWeek());
});

// FILTER IN TASK LIST:
// -- TO DO
// -- COMPLETED (HIDE/SHOW?)

// Test Delete

projectManager.deleteProject(1);