import "./styles/styles.css";
import { Task } from "./types/TaskTypes";
import { ProjectManager } from "./services/ProjectService";
import { TaskManager } from "./services/TaskService";
import {
  storeTasksToLocal,
  storeProjectsToLocal,
  retrieveLocalTasks,
  retrieveLocalProjects,
} from "./services/LocalStorage";

import { statuses, priorities, Status, Priority } from "./types/AppTypes";

let INBOX_ID = 1;

let activeProjectId = INBOX_ID;
let currentViewType = "project";
let currentFilter = "";

const projectManager = new ProjectManager();
const taskManager = new TaskManager();

const moduleContentDiv = document.querySelector("#module-content") as HTMLDivElement;
const modalContentDiv = document.querySelector("#modal-content") as HTMLDivElement;

const createElement = (tag: string, className: string, textContent?: string) => {
  const el = document.createElement(tag);
  el.className = className;
  if (textContent) el.textContent = textContent;
  return el;
};

const sidebar = createElement("div", "sidebar");
const filterContainer = createElement("div", "filter-container");
const projectListDiv = createElement("div", "project-list");
const newProjectDiv = createElement("div", "new-project");
const taskListContainer = createElement("div", "task-list-container");
const createTaskDiv = createElement("div", "create-task-div");
const newTaskButton = createElement("button", "new-task-btn", "+ New Task");

newTaskButton.addEventListener("click", () => {
  displayCreateTaskDiv();
});

const toggleNewTaskButton = (shouldShow: boolean) => {
  shouldShow
    ? newTaskButton.classList.remove("display-none")
    : newTaskButton.classList.add("display-none");
};

let isTaskPaneOpen = false;
let isModalOpen = false;

const toggleTaskPane = (shouldShow: boolean) => {
  isTaskPaneOpen = shouldShow;
  shouldShow
    ? taskPane.classList.remove("display-none")
    : taskPane.classList.add("display-none");
};

const clearHideTaskPane = () => {
  taskPane.textContent = "";
  createTaskDiv.textContent = "";
  toggleTaskPane(false);
};

document.addEventListener("mousedown", (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const isClickOutsideTaskPane =
    !taskPane.contains(target) &&
    !target.classList.contains("task-item") &&
    !target.classList.contains("new-task-btn");

  if (isModalOpen) {
    return;
  } else {
    if (isTaskPaneOpen && isClickOutsideTaskPane) {
      clearHideTaskPane();
    }
  }
});

const taskListDiv = createElement("div", "task-list");
const taskPane = createElement("div", "task-pane");
const modal = createElement("div", "modal");

const toggleModal = (shouldShow: boolean) => {
  isModalOpen = shouldShow;
  if (shouldShow) {
    modal.classList.remove("display-none");
    moduleContentDiv.classList.add("blurred");
  } else {
    modal.classList.add("display-none");
    moduleContentDiv.classList.remove("blurred");
  }
};

const displayNewProjectContainer = () => {
  const newProjectButton = createElement("button", "new-project-btn", "+ Add project");
  newProjectDiv.append(newProjectButton);

  newProjectButton.addEventListener("click", () => {
    newProjectDiv.removeChild(newProjectButton);

    const projectNameInput = createElement("input", "project-name-input") as HTMLInputElement;
    projectNameInput.value = "Untitled Project";
    projectNameInput.type = "text";

    const createProjectButton = createElement("button", "create-project-btn", "Create");

    newProjectDiv.appendChild(projectNameInput);
    newProjectDiv.appendChild(createProjectButton);

    createProjectButton.addEventListener("click", () => {
      const projectName = projectNameInput.value
        ? projectNameInput.value
        : "Untitled Project";
      projectManager.addProject({ id: null, name: projectName });
      storeProjectsToLocal(projectManager.projects);
      storeTasksToLocal(taskManager.getAllTasks());
      renderProjectList();
      renderTaskList();
      displayTaskFilters();

      newProjectDiv.removeChild(projectNameInput);
      newProjectDiv.removeChild(createProjectButton);
      newProjectDiv.appendChild(newProjectButton);
    });
  });
};

const clearContent = (element: HTMLElement) => {
  element.textContent = "";
};

const renderProjectList = () => {
  clearContent(projectListDiv);
  retrieveLocalProjects();

  projectManager.projects.forEach((project) => {
    const projectItemDiv = createElement("div", "project-item");
    projectListDiv.append(projectItemDiv);

    const projectInfoDiv = createElement("div", "project-info");
    projectItemDiv.append(projectInfoDiv);

    const projectNameDiv = createElement("div", "project-name", project.name);
    projectInfoDiv.append(projectNameDiv);

    const numTodoTasksDiv = document.createElement("div");
    numTodoTasksDiv.className = "num-tasks";
    numTodoTasksDiv.textContent = taskManager
      .getTasksByProject(project.id)
      .filter((task) => task.status !== "Done").length.toString();
    projectInfoDiv.append(numTodoTasksDiv);

    let projectOptionsDiv = null;

    const projectNameInput = document.createElement("input");
    projectNameInput.type = "text";
    projectNameInput.value = project.name;
    projectNameInput.style.display = "none";
    projectItemDiv.insertBefore(projectNameInput, projectInfoDiv);

    if (project.id !== INBOX_ID) {
      projectOptionsDiv = document.createElement("div");
      projectOptionsDiv.className = "project-options";

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

      projectOptionsDiv.append(editIcon);
      projectOptionsDiv.append(saveIcon);
      projectOptionsDiv.append(deleteIcon);

      projectItemDiv.append(projectOptionsDiv);

      editIcon.addEventListener("click", () => {
        projectNameDiv.style.display = "none";
        numTodoTasksDiv.style.display = "none";
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
        numTodoTasksDiv.style.display = "block";
        projectNameInput.style.display = "none";
        saveIcon.style.display = "none";
        editIcon.style.display = "block";
      });

      deleteIcon.addEventListener("click", () => {
        displayDeleteProjectModal(project.id);
      });
    }

    projectItemDiv.addEventListener("click", (e) => {
      if (!projectOptionsDiv || !projectOptionsDiv.contains(e.target as Node)) {
        currentViewType = "project";
        activeProjectId = project.id;
        renderTaskList();
        renderProjectList();
        displayTaskFilters();
      }
    });
  });
};

const displayDeleteProjectModal = (projectId: number) => {
  modal.textContent = "";

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

  modal.append(deletionMsg);
  modal.append(confirmDeletionBtn);
  modal.append(cancelDeletionBtn);

  toggleModal(true);

  confirmDeletionBtn.addEventListener("click", () => {
    taskManager.deleteAllTasksInProject(projectId);
    projectManager.deleteProject(projectId);
    storeProjectsToLocal(projectManager.projects);
    storeTasksToLocal(taskManager.getAllTasks());
    renderProjectList();
    activeProjectId = INBOX_ID;
    renderTaskList();
    displayTaskFilters();
    toggleModal(false);
  });

  cancelDeletionBtn.addEventListener("click", () => {
    toggleModal(false);
  });
};

const displayTasks = (tabName: string, tasks: Task[]) => {
  clearContent(taskListDiv);
  const taskListHeader = document.createElement("h2");
  taskListHeader.className = "task-list-header";
  taskListHeader.textContent = tabName;
  taskListDiv.append(taskListHeader);

  const toDoTasks = tasks.filter((task) => task.status === "To do");
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
        storeTasksToLocal(taskManager.getAllTasks());
        renderTaskList();
        renderProjectList();
        displayTaskFilters();
      });

      const taskTitle = document.createElement("span");
      taskTitle.textContent = task.title;
      taskTitle.addEventListener("click", (e) => {
        e.stopPropagation();
        displayTaskPane(task.id);
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
        storeTasksToLocal(taskManager.getAllTasks());
        renderTaskList();
        renderProjectList();
        displayTaskFilters();
      });

      const taskTitle = document.createElement("span");
      taskTitle.textContent = task.title;
      taskTitle.addEventListener("click", (e) => {
        e.stopPropagation();
        displayTaskPane(task.id);
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
  retrieveLocalTasks();
  if (currentViewType === "project") {
    displayTasksInProject(activeProjectId);
    toggleNewTaskButton(true);
  } else if (currentViewType === "filter") {
    toggleNewTaskButton(false);
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
    toggleNewTaskButton(true);
  }
};

const displayCreateTaskDiv = () => {
  clearHideTaskPane();

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

  createTaskDiv.appendChild(titleEl);
  createTaskDiv.appendChild(statusEl);
  createTaskDiv.appendChild(priorityEl);
  createTaskDiv.appendChild(dueDateEl);
  createTaskDiv.appendChild(notesEl);
  createTaskDiv.appendChild(saveButton);
  createTaskDiv.appendChild(cancelButton);

  taskPane.appendChild(createTaskDiv);

  toggleTaskPane(true);

  saveButton.addEventListener("click", () => {
    const newTask = new Task({
      id: null,
      projectId: activeProjectId,
      status: statusEl.value as Status,
      title: titleEl.value,
      dueDate: new Date(dueDateEl.value),
      priority: priorityEl.value as Priority,
      notes: notesEl.value
    }
    );

    taskManager.addTask(newTask);
    storeTasksToLocal(taskManager.getAllTasks());
    renderProjectList();
    renderTaskList();
    displayTaskFilters();
    clearHideTaskPane();
  });

  cancelButton.addEventListener("click", () => {
    clearHideTaskPane();
  });
};

const displayDeleteTaskModal = (taskId: number) => {
  toggleModal(true);
  modal.textContent = "";

  const deletionMsg = document.createElement("div");
  deletionMsg.className = "delete-msg";
  deletionMsg.textContent = "The task will be deleted permanently.";

  const confirmDeletionBtn = document.createElement("button");
  confirmDeletionBtn.className = "confirm-btn";
  confirmDeletionBtn.textContent = "Delete";

  const cancelDeletionBtn = document.createElement("button");
  cancelDeletionBtn.className = "cancel-btn";
  cancelDeletionBtn.textContent = "Cancel";

  modal.append(deletionMsg);
  modal.append(confirmDeletionBtn);
  modal.append(cancelDeletionBtn);

  confirmDeletionBtn.addEventListener("click", () => {
    taskManager.deleteTask(taskId);
    storeTasksToLocal(taskManager.getAllTasks());
    renderProjectList();
    renderTaskList();
    displayTaskFilters();
    toggleModal(false);
    toggleTaskPane(false);
  });

  cancelDeletionBtn.addEventListener("click", () => {
    toggleModal(false);
  });
};

const displayTaskPane = (taskId: number) => {
  let task = taskManager.getTask(taskId);
  if (!task) return;

  taskPane.textContent = "";

  const titleEl = document.createElement("input");
  titleEl.className = "task-title";
  titleEl.type = "text";
  titleEl.value = task.title;
  titleEl.addEventListener("blur", () => {
    task.title = titleEl.value.toString();
    taskManager.updateTask(taskId, task);
    storeTasksToLocal(taskManager.getAllTasks());
    renderProjectList();
    renderTaskList();
    displayTaskFilters();
  });

  const projectEl = document.createElement("select");
  projectEl.className = "task-project";

  projectManager.projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id.toString();
    option.textContent = project.name;
    projectEl.append(option);
  });

  projectEl.value = task.projectId.toString();

  projectEl.addEventListener("change", () => {
    const newProjectId = parseInt(projectEl.value);
    taskManager.moveTask(taskId, newProjectId);
    storeTasksToLocal(taskManager.getAllTasks());
    renderProjectList();
    renderTaskList();
    displayTaskFilters();
  });

  const statusEl = document.createElement("select");
  statusEl.className = "task-status";
  statuses.forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    statusEl.append(option);
  });
  statusEl.value = task.status;
  statusEl.addEventListener("blur", () => {
    task.status = statusEl.value as Status;
    taskManager.updateTask(taskId, task);
    storeTasksToLocal(taskManager.getAllTasks());
    renderProjectList();
    renderTaskList();
    displayTaskFilters();
  });

  const priorityEl = document.createElement("select");
  priorityEl.className = "task-priority";
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority;
    priorityEl.append(option);
  });
  priorityEl.value = task.priority;
  priorityEl.addEventListener("blur", () => {
    task.priority = priorityEl.value as Priority;
    taskManager.updateTask(taskId, task);
    storeTasksToLocal(taskManager.getAllTasks());
    renderProjectList();
    renderTaskList();
    displayTaskFilters();
  });

  const dueDateEl = document.createElement("input");
  dueDateEl.className = "due-date";
  dueDateEl.type = "date";
  dueDateEl.value = task.dueDate.toISOString().split("T")[0];
  dueDateEl.addEventListener("blur", () => {
    task.dueDate = new Date(dueDateEl.value);
    taskManager.updateTask(taskId, task);
    storeTasksToLocal(taskManager.getAllTasks());
    renderProjectList();
    renderTaskList();
    displayTaskFilters();
  });

  const notesEl = document.createElement("textarea");
  notesEl.className = "notes";
  notesEl.value = task.notes;
  notesEl.addEventListener("blur", () => {
    task.notes = notesEl.value;
    taskManager.updateTask(taskId, task);
    storeTasksToLocal(taskManager.getAllTasks());
    renderProjectList();
    renderTaskList();
    displayTaskFilters();
  });

  const deleteTaskBtn = document.createElement("button");
  deleteTaskBtn.className = "deleteTaskBtn";
  deleteTaskBtn.textContent = "🗑 Delete Task";
  deleteTaskBtn.addEventListener("click", () => {
    displayDeleteTaskModal(taskId);
  });

  taskPane.appendChild(titleEl);
  taskPane.appendChild(statusEl);
  taskPane.appendChild(projectEl);
  taskPane.appendChild(priorityEl);
  taskPane.appendChild(dueDateEl);
  taskPane.appendChild(notesEl);
  taskPane.appendChild(deleteTaskBtn);

  toggleTaskPane(true);
};

const displayTasksInProject = (projectId: number) => {
  let projectName = projectManager.findProjectNameFromId(projectId);
  if (!projectName) return; // Or throw error
  displayTasks(projectName, taskManager.getTasksByProject(projectId));
};

const displayTaskFilters = () => {
  filterContainer.textContent = "";

  const allTasksName = document.createElement("div");
  allTasksName.textContent = "📋 All Tasks";

  const allTasksNum = document.createElement("div");
  allTasksNum.className = "num-tasks";
  allTasksNum.textContent = taskManager.getAllTasks().filter(task => task.status !== "Done").length.toString();

  const allTasksFilterItem = document.createElement("div");
  allTasksFilterItem.className = "filter-item";
  const allTasksFilterInfo = document.createElement("div");
  allTasksFilterInfo.className = "filter-info";

  allTasksFilterInfo.appendChild(allTasksName);
  allTasksFilterInfo.appendChild(allTasksNum);
  allTasksFilterItem.appendChild(allTasksFilterInfo);

  allTasksFilterItem.addEventListener("click", () => {
    currentViewType = "filter";
    currentFilter = "All Tasks";
    const allTasks = taskManager.getAllTasks();
    displayTasks("All Tasks", allTasks);
  });

  const dueTodayName = document.createElement("div");
  dueTodayName.textContent = "🔥 Due Today";

  const dueTodayNum = document.createElement("div");
  dueTodayNum.className = "num-tasks";
  dueTodayNum.textContent = taskManager.getTasksDueToday()
    .filter(task => task.status !== "Done")
    .length
    .toString();

  const dueTodayFilterItem = document.createElement("div");
  dueTodayFilterItem.className = "filter-item";
  const dueTodayFilterInfo = document.createElement("div");
  dueTodayFilterInfo.className = "filter-info";

  dueTodayFilterInfo.appendChild(dueTodayName);
  dueTodayFilterInfo.appendChild(dueTodayNum);
  dueTodayFilterItem.appendChild(dueTodayFilterInfo);

  dueTodayFilterItem.addEventListener("click", () => {
    currentViewType = "filter";
    currentFilter = "Due Today";
    const dueTodayTasks = taskManager.getTasksDueToday();
    displayTasks("Due Today", dueTodayTasks);
  });

  const dueThisWeekName = document.createElement("div");
  dueThisWeekName.textContent = "🗓️ Due This Week";

  const dueThisWeekNum = document.createElement("div");
  dueThisWeekNum.className = "num-tasks";
  dueThisWeekNum.textContent = taskManager.getTasksDueThisWeek()
    .filter((task) => task.status !== "Done")
    .length.toString();

  const dueThisWeekFilterItem = document.createElement("div");
  dueThisWeekFilterItem.className = "filter-item";
  const dueThisWeekFilterInfo = document.createElement("div");
  dueThisWeekFilterInfo.className = "filter-info";

  dueThisWeekFilterInfo.append(dueThisWeekName, dueThisWeekNum);
  dueThisWeekFilterItem.append(dueThisWeekFilterInfo);

  dueThisWeekFilterItem.addEventListener("click", () => {
    currentViewType = "filter";
    currentFilter = "Due This Week";
    const dueThisWeekTasks = taskManager.getTasksDueThisWeek();
    displayTasks("Due This Week", dueThisWeekTasks);
  });

  filterContainer.append(allTasksFilterItem, dueTodayFilterItem, dueThisWeekFilterItem);
};

filterContainer.addEventListener("click", () => {
  renderTaskList();
  renderProjectList();
  displayTaskFilters();
});

const listProjects = () => {
  projectManager.addProject({ id: INBOX_ID, name: "🏠 Inbox" });
  let storedProjectArray = retrieveLocalProjects();
  if (storedProjectArray && storedProjectArray.length > 0) {
    storedProjectArray.forEach((projectData) => {
      projectManager.addProject({ id: projectData.id, name: projectData.name });
    });
  }
  console.table(projectManager);
};

listProjects();

const listTasks = () => {
  let storedTaskArray = retrieveLocalTasks();
  storedTaskArray.forEach((taskData) => {
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
    taskManager.addTask(task);
  });
  console.table(taskManager.getAllTasks());
};

listTasks();

const initializeLayout = () => {
  const header = createElement("header", "");
  const h1 = createElement("h1", "", "✔️ [to do]");

  header.append(h1);
  h1.addEventListener("click", function () {
    activeProjectId = INBOX_ID;
    renderPage();
  });

  moduleContentDiv.textContent = "";
  sidebar.append(projectListDiv);
  sidebar.append(newProjectDiv);
  sidebar.insertBefore(filterContainer, projectListDiv);
  moduleContentDiv.append(header);
  moduleContentDiv.append(sidebar);
  moduleContentDiv.append(taskListContainer);
  taskListContainer.append(newTaskButton);
  taskListContainer.append(taskListDiv);
  taskPane.append(createTaskDiv);
  moduleContentDiv.append(taskPane);
  modalContentDiv.append(modal);
};

const loadPage = () => {
  activeProjectId = INBOX_ID;
  retrieveLocalProjects();
  retrieveLocalTasks();
  renderTaskList();
  renderProjectList();

  initializeLayout();

  displayTaskFilters();
  displayNewProjectContainer();
  toggleNewTaskButton(true);
  toggleModal(false);
  toggleTaskPane(false);
};

loadPage();

const renderPage = () => {
  renderTaskList();
  renderProjectList();

  displayTaskFilters();

  toggleModal(false);
  toggleTaskPane(false);
};
