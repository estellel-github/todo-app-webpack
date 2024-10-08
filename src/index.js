import "./styles/styles.css";
import { Project } from "./modules/Project";
import { Task } from "./modules/Task";
import { ProjectManager } from "./modules/ProjectManager";
import { TaskManager } from "./modules/TaskManager";
import {
  storeTasksToLocal,
  storeProjectsToLocal,
  retrieveLocalTasks,
  retrieveLocalProjects,
} from "./modules/LocalStorage";

let INBOX_ID = 1;

let activeProjectId = INBOX_ID;
let currentViewType = "project";
let currentFilter = "";

const projectManager = new ProjectManager();
const taskManager = new TaskManager();

const moduleContentDiv = document.querySelector("#module-content");

const sidebar = document.createElement("div");
sidebar.className = "sidebar";

const projectListDiv = document.createElement("div");
projectListDiv.className = "project-list";

const newProjectDiv = document.createElement("div");
newProjectDiv.className = "new-task";

const mainContainer = document.createElement("div");
mainContainer.className = "main-container";

const newTaskButton = document.createElement("button");
newTaskButton.className = "new-task-btn";
newTaskButton.textContent = "+ New Task";
newTaskButton.addEventListener("click", () => {
  displayCreateTaskModal();
});

const taskListDiv = document.createElement("div");
taskListDiv.className = "task-list";

const taskModal = document.createElement("div");
taskModal.className = "task-modal";

const deleteTaskModal = document.createElement("div");
deleteTaskModal.className = "delete-task-modal";

const projectModal = document.createElement("div");
projectModal.className = "project-modal";

const deleteProjectModal = document.createElement("div");
deleteProjectModal.className = "delete-project-modal";

const displayNewProjectContainer = () => {
  const newProjectButton = document.createElement("button");
  newProjectButton.className = "new-project-btn";
  newProjectButton.textContent = "+ Add project";
  newProjectDiv.append(newProjectButton);

  newProjectButton.addEventListener("click", () => {
    newProjectDiv.removeChild(newProjectButton);

    const projectNameInput = document.createElement("input");
    projectNameInput.className = "project-name-input";
    projectNameInput.value = "Untitled Project";
    projectNameInput.type = "text";

    const createProjectButton = document.createElement("button");
    createProjectButton.className = "create-project-btn";
    createProjectButton.textContent = "Create";

    newProjectDiv.appendChild(projectNameInput);
    newProjectDiv.appendChild(createProjectButton);

    createProjectButton.addEventListener("click", () => {
      const projectName = projectNameInput.value
        ? projectNameInput.value
        : "Untitled Project";
      projectManager.addProject(null, projectName);
      storeProjectsToLocal(projectManager.projects);
      renderProjectList();

      newProjectDiv.removeChild(projectNameInput);
      newProjectDiv.removeChild(createProjectButton);
      newProjectDiv.appendChild(newProjectButton);
    });
  });
};

const clearProjectList = () => {
  projectListDiv.textContent = "";
};

function clearTaskList() {
  taskListDiv.textContent = "";
}

const renderProjectList = () => {
  clearProjectList();

  projectManager.projects.forEach((project) => {
    const projectItemDiv = document.createElement("div");
    projectItemDiv.className = "project-item";
    projectListDiv.append(projectItemDiv);

    const projectNameDiv = document.createElement("div");
    projectNameDiv.textContent = project.name;
    projectItemDiv.append(projectNameDiv);

    const numTasksDiv = document.createElement("div");
    numTasksDiv.className = "num-tasks";
    numTasksDiv.textContent = taskManager.getNumTasksByProject(project.id);
    projectItemDiv.append(numTasksDiv);

    projectItemDiv.addEventListener("click", () => {
      currentViewType = "project";
      activeProjectId = project.id;
      renderTaskList();
    });

    const projectNameInput = document.createElement("input");
    projectNameInput.type = "text";
    projectNameInput.value = project.name;
    projectNameInput.style.display = "none";
    projectItemDiv.insertBefore(projectNameInput, numTasksDiv);

    if (project.id !== INBOX_ID) {
      const editIcon = document.createElement("button");
      editIcon.className = "edit-icon";
      editIcon.textContent = "✏️";

      const saveIcon = document.createElement("button");
      saveIcon.className = "save-icon";
      saveIcon.textContent = "💾";
      saveIcon.style.display = "none";

      const deleteIcon = document.createElement("button");
      deleteIcon.className = "delete-icon";
      deleteIcon.textContent = "🗑️";

      projectItemDiv.append(editIcon);
      projectItemDiv.append(saveIcon);
      projectItemDiv.append(deleteIcon);

      editIcon.addEventListener("click", () => {
        projectNameDiv.style.display = "none";
        projectNameInput.style.display = "block";
        editIcon.style.display = "none";
        saveIcon.style.display = "block";
      });

      saveIcon.addEventListener("click", () => {
        const newName = projectNameInput.value;
        project.name = newName;
        projectManager.renameProject(project.id, newName);
        storeProjectsToLocal(projectManager.projects);

        projectNameDiv.textContent = newName;
        projectNameDiv.style.display = "block";
        projectNameInput.style.display = "none";
        saveIcon.style.display = "none";
        editIcon.style.display = "block";
      });

      deleteIcon.addEventListener("click", () => {
        displayDeleteProjectModal(project.id);
      });
    }
  });
};

const displayDeleteProjectModal = (projectId) => {
  deleteProjectModal.textContent = "";

  const deletionMsg = document.createElement("div");
  deletionMsg.className = "delete-msg";
  deletionMsg.textContent =
    "This project and all its tasks will be deleted permanently.";

  const confirmDeletionBtn = document.createElement("button");
  confirmDeletionBtn.className = "confirm-btn";
  confirmDeletionBtn.textContent = "Delete";

  const cancelDeletionBtn = document.createElement("button");
  cancelDeletionBtn.className = "cancel-btn";
  cancelDeletionBtn.textContent = "Cancel";

  deleteProjectModal.append(deletionMsg);
  deleteProjectModal.append(confirmDeletionBtn);
  deleteProjectModal.append(cancelDeletionBtn);

  moduleContentDiv.append(deleteProjectModal);

  confirmDeletionBtn.addEventListener("click", () => {
    taskManager.deleteAllTasksInProject(projectId);
    projectManager.deleteProject(projectId);
    storeProjectsToLocal(projectManager.projects);
    storeTasksToLocal(taskManager.getAllTasks());
    renderProjectList();
    displayTasksInProject(INBOX_ID);
    moduleContentDiv.removeChild(deleteProjectModal);
  });

  cancelDeletionBtn.addEventListener("click", () => {
    moduleContentDiv.removeChild(deleteProjectModal);
  });
};

const displayTasks = (tabName, tasks) => {
  clearTaskList();
  const taskListHeader = document.createElement("h2");
  taskListHeader.textContent = tabName;
  taskListDiv.append(taskListHeader);

  const toDoTasks = tasks.filter(
    (task) => task.status === "To do" || task.status === "In Progress"
  );
  const doneTasks = tasks.filter((task) => task.status === "Done");

  if (toDoTasks.length > 0) {
    toDoTasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.classList.add("task-item", "to-do");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = false;
      checkbox.addEventListener("click", () => {
        task.status = "Done";
        taskManager.updateTask(task.id, task);
        renderTaskList();
      });

      const taskTitle = document.createElement("span");
      taskTitle.textContent = task.title;
      taskTitle.addEventListener("click", (e) => {
        e.stopPropagation();
        displayTaskModal(task.id);
      });

      taskItem.appendChild(checkbox);
      taskItem.appendChild(taskTitle);
      taskListDiv.append(taskItem);
    });
  } else {
    const emptyProjectMsg = document.createElement("div");
    emptyProjectMsg.className = "empty-list-msg";
    emptyProjectMsg.textContent = "This list is empty. Add a new task!";
    taskListDiv.append(emptyProjectMsg);
  }

  if (doneTasks.length > 0) {
    const doneHeader = document.createElement("h3");
    doneHeader.className = "collapsible-header";
    doneHeader.textContent = "▶ Done";

    const doneTasksContainer = document.createElement("div");
    doneTasksContainer.className = "done-tasks-container";
    doneTasksContainer.style.display = "none";

    doneTasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.className = "task-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = true;
      checkbox.addEventListener("click", () => {
        task.status = "To do";
        taskManager.updateTask(task.id, task);
        renderTaskList();
      });

      const taskTitle = document.createElement("span");
      taskTitle.textContent = task.title;
      taskTitle.addEventListener("click", (e) => {
        e.stopPropagation();
        displayTaskModal(task.id);
      });

      taskItem.appendChild(checkbox);
      taskItem.appendChild(taskTitle);
      doneTasksContainer.append(taskItem);
    });

    doneHeader.addEventListener("click", () => {
      doneHeader.textContent =
        doneHeader.textContent === "▼ Done" ? "▶ Done" : "▼ Done";
      doneTasksContainer.style.display =
        doneTasksContainer.style.display === "none" ? "block" : "none";
    });

    taskListDiv.append(doneHeader);
    taskListDiv.append(doneTasksContainer);
  }
};

const renderTaskList = () => {
  if (currentViewType === "project") {
    displayTasksInProject(activeProjectId);
    newTaskButton.style.display = "block";
  } else if (currentViewType === "filter") {
    newTaskButton.style.display = "none";
    switch (currentFilter) {
      case "All Tasks":
        displayTasks("All Tasks", taskManager.getAllTasks());
        break;
      case "Due Today":
        displayTasks("Due Today", taskManager.getTasksDueToday());
        break;
      case "Due This Week":
        displayTasks("Due This Week", taskManager.getTasksDueThisWeek());
        break;
    }
  } else {
    displayTasksInProject(INBOX_ID);
    newTaskButton.style.display = "block";
  }
};

const displayCreateTaskModal = () => {
  const createTaskModal = document.createElement("div");
  createTaskModal.className = "create-task-modal";

  const defaultTitle = "New Task";
  const defaultStatus = "To do";
  const defaultPriority = "High";
  const defaultNotes = "Add notes here...";
  const defaultDueDate = new Date().toISOString().split("T")[0];

  const titleEl = document.createElement("input");
  titleEl.className = "task-title";
  titleEl.type = "text";
  titleEl.value = defaultTitle;

  const statusEl = document.createElement("select");
  statusEl.className = "task-status";
  ["To do", "Done"].forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    statusEl.append(option);
  });
  statusEl.value = defaultStatus;

  const priorityEl = document.createElement("select");
  priorityEl.className = "task-priority";
  ["Low", "High"].forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority;
    priorityEl.append(option);
  });
  priorityEl.value = defaultPriority;

  const dueDateEl = document.createElement("input");
  dueDateEl.className = "due-date";
  dueDateEl.type = "date";
  dueDateEl.value = defaultDueDate;

  const notesEl = document.createElement("textarea");
  notesEl.className = "notes";
  notesEl.value = defaultNotes;

  const saveButton = document.createElement("button");
  saveButton.className = "save-task-btn";
  saveButton.textContent = "Create Task";

  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel-task-btn";
  cancelButton.textContent = "Cancel";

  createTaskModal.appendChild(titleEl);
  createTaskModal.appendChild(statusEl);
  createTaskModal.appendChild(priorityEl);
  createTaskModal.appendChild(dueDateEl);
  createTaskModal.appendChild(notesEl);
  createTaskModal.appendChild(saveButton);
  createTaskModal.appendChild(cancelButton);

  moduleContentDiv.append(createTaskModal);

  saveButton.addEventListener("click", () => {
    const newTask = new Task(
      null,
      activeProjectId,
      statusEl.value,
      titleEl.value,
      new Date(dueDateEl.value),
      priorityEl.value,
      notesEl.value
    );

    taskManager.addTask(newTask);
    storeTasksToLocal(taskManager.getAllTasks());
    renderProjectList();
    renderTaskList();
    moduleContentDiv.removeChild(createTaskModal);
  });

  cancelButton.addEventListener("click", () => {
    moduleContentDiv.removeChild(createTaskModal);
  });
};

const displayDeleteTaskModal = (taskId) => {
  moduleContentDiv.append(deleteTaskModal);
  deleteTaskModal.textContent = "";

  const deletionMsg = document.createElement("div");
  deletionMsg.className = "delete-msg";
  deletionMsg.textContent = "The task will be deleted permanently.";

  const confirmDeletionBtn = document.createElement("button");
  confirmDeletionBtn.className = "confirm-btn";
  confirmDeletionBtn.textContent = "Delete";

  const cancelDeletionBtn = document.createElement("button");
  cancelDeletionBtn.className = "cancel-btn";
  cancelDeletionBtn.textContent = "Cancel";

  deleteTaskModal.append(deletionMsg);
  deleteTaskModal.append(confirmDeletionBtn);
  deleteTaskModal.append(cancelDeletionBtn);

  confirmDeletionBtn.addEventListener("click", () => {
    taskManager.deleteTask(taskId);
    storeTasksToLocal(taskManager.getAllTasks());
    renderProjectList();
    renderTaskList();
    moduleContentDiv.removeChild(deleteTaskModal);
    moduleContentDiv.removeChild(taskModal);
  });

  cancelDeletionBtn.addEventListener("click", () => {
    moduleContentDiv.removeChild(deleteTaskModal);
  });
};

const displayTaskModal = (taskId) => {
  let task = taskManager.getTask(taskId);
  taskModal.textContent = "";

  const titleEl = document.createElement("input");
  titleEl.className = "task-title";
  titleEl.type = "text";
  titleEl.value = task.title;
  titleEl.addEventListener("blur", () => {
    task.title = titleEl.value;
    taskManager.updateTask(taskId, task);
    storeTasksToLocal(taskManager.getAllTasks());
    renderTaskList();
  });

  const projectEl = document.createElement("select");
  projectEl.className = "task-project";

  projectManager.projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    projectEl.append(option);
  });

  projectEl.value = task.projectId;

  projectEl.addEventListener("change", () => {
    const newProjectId = parseInt(projectEl.value);
    taskManager.moveTask(taskId, newProjectId);
    storeTasksToLocal(taskManager.getAllTasks());
    renderTaskList();
  });

  const statusEl = document.createElement("select");
  statusEl.className = "task-status";
  ["To do", "Done"].forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    statusEl.append(option);
  });
  statusEl.value = task.status;
  statusEl.addEventListener("blur", () => {
    task.status = statusEl.value;
    taskManager.updateTask(taskId, task);
    storeTasksToLocal(taskManager.getAllTasks());
    renderTaskList();
  });

  const priorityEl = document.createElement("select");
  priorityEl.className = "task-priority";
  ["Low", "High"].forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority;
    priorityEl.append(option);
  });
  priorityEl.value = task.priority;
  priorityEl.addEventListener("blur", () => {
    task.priority = priorityEl.value;
    taskManager.updateTask(taskId, task);
    storeTasksToLocal(taskManager.getAllTasks());
    renderTaskList();
  });

  const dueDateEl = document.createElement("input");
  dueDateEl.className = "due-date";
  dueDateEl.type = "date";
  dueDateEl.value = task.dueDate.toISOString().split("T")[0];
  dueDateEl.addEventListener("blur", () => {
    task.dueDate = new Date(dueDateEl.value);
    taskManager.updateTask(taskId, task);
    storeTasksToLocal(taskManager.getAllTasks());
    renderTaskList();
  });

  const notesEl = document.createElement("textarea");
  notesEl.className = "notes";
  notesEl.value = task.notes;
  notesEl.addEventListener("blur", () => {
    task.notes = notesEl.value;
    taskManager.updateTask(taskId, task);
    Tasks(taskManager.getAllTasks());
    renderTaskList();
  });

  const deleteTaskBtn = document.createElement("button");
  deleteTaskBtn.className = "deleteTaskBtn";
  deleteTaskBtn.textContent = "🗑 Delete Task";
  deleteTaskBtn.addEventListener("click", () => {
    displayDeleteTaskModal(taskId);
  });

  taskModal.appendChild(titleEl);
  taskModal.appendChild(statusEl);
  taskModal.appendChild(projectEl);
  taskModal.appendChild(priorityEl);
  taskModal.appendChild(dueDateEl);
  taskModal.appendChild(notesEl);
  taskModal.appendChild(deleteTaskBtn);
  moduleContentDiv.append(taskModal);
};

const displayTasksInProject = (projectId) => {
  let projectName = projectManager.findProjectNameFromId(projectId);
  displayTasks(projectName, taskManager.getTasksByProject(projectId));
};

const displayTaskFilters = () => {
  const filterContainer = document.createElement("div");
  filterContainer.className = "filter-container";

  const allTasksBtn = document.createElement("div");
  allTasksBtn.className = "filter-item";
  allTasksBtn.textContent = "All Tasks";
  allTasksBtn.addEventListener("click", () => {
    currentViewType = "filter";
    currentFilter = "All Tasks";
    const allTasks = taskManager.getAllTasks();
    displayTasks("All Tasks", allTasks);
  });

  const dueTodayBtn = document.createElement("div");
  dueTodayBtn.className = "filter-item";
  dueTodayBtn.textContent = "Due Today";
  dueTodayBtn.addEventListener("click", () => {
    currentViewType = "filter";
    currentFilter = "Due Today";
    const dueTodayTasks = taskManager.getTasksDueToday();
    displayTasks("Due Today", dueTodayTasks);
  });

  const dueThisWeekBtn = document.createElement("div");
  dueThisWeekBtn.className = "filter-item";
  dueThisWeekBtn.textContent = "Due This Week";
  dueThisWeekBtn.addEventListener("click", () => {
    currentViewType = "filter";
    currentFilter = "Due This Week";
    const dueThisWeekTasks = taskManager.getTasksDueThisWeek();
    displayTasks("Due This Week", dueThisWeekTasks);
  });

  filterContainer.append(allTasksBtn, dueTodayBtn, dueThisWeekBtn);

  sidebar.insertBefore(filterContainer, projectListDiv);
};

const listProjects = () => {
  projectManager.addProject(INBOX_ID, "Inbox");
  let storedProjectArray = retrieveLocalProjects();
  if (storedProjectArray && storedProjectArray.length > 0) {
    storedProjectArray.forEach((projectData) => {
      projectManager.addProject(projectData._id, projectData._name);
    });
  }
  console.table(projectManager);
};

listProjects();

const listTasks = () => {
  let storedTaskArray = retrieveLocalTasks();
  storedTaskArray.forEach((taskData) => {
    const task = new Task(
      taskData.id,
      taskData._projectId,
      taskData._status,
      taskData._title,
      new Date(taskData._dueDate),
      taskData._priority,
      taskData._notes
    );
    taskManager.addTask(task);
  });
  console.table(taskManager.getAllTasks());
};

listTasks();

const initializeLayout = () => {
  sidebar.append(projectListDiv);
  sidebar.append(newProjectDiv);
  moduleContentDiv.append(sidebar);
  taskListDiv.append(newTaskButton);
  moduleContentDiv.append(mainContainer);
  moduleContentDiv.append(taskListDiv);
};

const loadPage = () => {
  retrieveLocalProjects();
  retrieveLocalTasks();
  renderTaskList();
  renderProjectList();

  initializeLayout();

  displayTaskFilters();
  displayNewProjectContainer();
  newTaskButton.style.display = "block";
};

loadPage();

// TO DO:

// New task button => only display for project view (not filtered views!)

// ADJUST MODAL CLOSING LOGIC (have a common class, set to display none instead of removing, have bg blurred and close when clicking out)

// "Prettify"
// Make responsive (Sidebar -> Task List -> Task)

// NICE TO HAVE:

// ENABLE DRAG-DROP TO MOVE TO OTHER PROJECT

// Implement basic search

// Make sidebar resizeable
