"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./styles/styles.css");
const Task_1 = require("./modules/Task");
const ProjectManager_1 = require("./modules/ProjectManager");
const TaskManager_1 = require("./modules/TaskManager");
const LocalStorage_1 = require("./modules/LocalStorage");
const types_1 = require("./modules/types");
let INBOX_ID = 1;
let activeProjectId = INBOX_ID;
let currentViewType = "project";
let currentFilter = "";
const projectManager = new ProjectManager_1.ProjectManager();
const taskManager = new TaskManager_1.TaskManager();
const moduleContentDiv = document.querySelector("#module-content");
const modalContentDiv = document.querySelector("#modal-content");
const sidebar = document.createElement("div");
sidebar.className = "sidebar";
const filterContainer = document.createElement("div");
filterContainer.className = "filter-container";
const projectListDiv = document.createElement("div");
projectListDiv.className = "project-list";
const newProjectDiv = document.createElement("div");
newProjectDiv.className = "new-project";
const taskListContainer = document.createElement("div");
taskListContainer.className = "task-list-container";
const createTaskDiv = document.createElement("div");
createTaskDiv.className = "create-task-div";
const newTaskButton = document.createElement("button");
newTaskButton.className = "new-task-btn";
newTaskButton.textContent = "+ New Task";
newTaskButton.addEventListener("click", () => {
    displayCreateTaskDiv();
});
const header = document.createElement("header");
const h1 = document.createElement("h1");
h1.textContent = "✔️ [to do]";
header.append(h1);
h1.addEventListener("click", function () {
    activeProjectId = INBOX_ID;
    renderPage();
});
const toggleNewTaskButton = (shouldShow) => {
    shouldShow
        ? newTaskButton.classList.remove("display-none")
        : newTaskButton.classList.add("display-none");
};
const toggleTaskPane = (shouldShow) => {
    shouldShow
        ? taskPane.classList.remove("display-none")
        : taskPane.classList.add("display-none");
};
const clearHideTaskPane = () => {
    taskPane.textContent = "";
    createTaskDiv.textContent = "";
    toggleTaskPane(false);
};
document.addEventListener("click", (event) => {
    const target = event.target;
    const isClickOutside = !taskPane.contains(target) && !target.classList.contains("task-item") && !target.classList.contains("new-task-btn");
    if (!taskPane.classList.contains("display-none") && isClickOutside) {
        clearHideTaskPane();
    }
});
const taskListDiv = document.createElement("div");
taskListDiv.className = "task-list";
const taskPane = document.createElement("div");
taskPane.className = "task-pane";
const modal = document.createElement("div");
modal.className = "modal";
const toggleModal = (shouldShow) => {
    if (shouldShow) {
        modal.classList.remove("display-none");
        moduleContentDiv.classList.add("blurred");
    }
    else {
        modal.classList.add("display-none");
        moduleContentDiv.classList.remove("blurred");
    }
};
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
            projectManager.addProject({ id: null, name: projectName });
            (0, LocalStorage_1.storeProjectsToLocal)(projectManager.projects);
            (0, LocalStorage_1.storeTasksToLocal)(taskManager.getAllTasks());
            renderProjectList();
            renderTaskList();
            displayTaskFilters();
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
    (0, LocalStorage_1.retrieveLocalProjects)();
    projectManager.projects.forEach((project) => {
        const projectItemDiv = document.createElement("div");
        projectItemDiv.className = "project-item";
        projectListDiv.append(projectItemDiv);
        const projectNameDiv = document.createElement("div");
        projectNameDiv.className = "project-name";
        projectNameDiv.textContent = project.name;
        projectItemDiv.append(projectNameDiv);
        const numTodoTasksDiv = document.createElement("div");
        numTodoTasksDiv.className = "num-tasks";
        numTodoTasksDiv.textContent = taskManager.getTasksByProject(project.id).filter(task => task.status !== "Done").length.toString();
        projectItemDiv.append(numTodoTasksDiv);
        projectItemDiv.addEventListener("click", () => {
            currentViewType = "project";
            activeProjectId = project.id;
            renderTaskList();
            renderProjectList();
            displayTaskFilters();
        });
        const projectNameInput = document.createElement("input");
        projectNameInput.type = "text";
        projectNameInput.value = project.name;
        projectNameInput.style.display = "none";
        projectItemDiv.insertBefore(projectNameInput, numTodoTasksDiv);
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
                (0, LocalStorage_1.storeProjectsToLocal)(projectManager.projects);
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
        (0, LocalStorage_1.storeProjectsToLocal)(projectManager.projects);
        (0, LocalStorage_1.storeTasksToLocal)(taskManager.getAllTasks());
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
const displayTasks = (tabName, tasks) => {
    clearTaskList();
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
                (0, LocalStorage_1.storeTasksToLocal)(taskManager.getAllTasks());
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
    }
    else {
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
                (0, LocalStorage_1.storeTasksToLocal)(taskManager.getAllTasks());
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
    (0, LocalStorage_1.retrieveLocalTasks)();
    if (currentViewType === "project") {
        displayTasksInProject(activeProjectId);
        toggleNewTaskButton(true);
    }
    else if (currentViewType === "filter") {
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
    }
    else {
        displayTasksInProject(INBOX_ID);
        toggleNewTaskButton(true);
    }
};
const displayCreateTaskDiv = () => {
    createTaskDiv.textContent = "";
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
    toggleTaskPane(true);
    saveButton.addEventListener("click", () => {
        const newTask = new Task_1.Task({
            id: null,
            projectId: activeProjectId,
            status: statusEl.value,
            title: titleEl.value,
            dueDate: new Date(dueDateEl.value),
            priority: priorityEl.value,
            notes: notesEl.value
        });
        taskManager.addTask(newTask);
        (0, LocalStorage_1.storeTasksToLocal)(taskManager.getAllTasks());
        renderProjectList();
        renderTaskList();
        displayTaskFilters();
        createTaskDiv.textContent = "";
        toggleTaskPane(false);
    });
    cancelButton.addEventListener("click", () => {
        createTaskDiv.textContent = "";
        toggleTaskPane(false);
    });
};
const displayDeleteTaskModal = (taskId) => {
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
        (0, LocalStorage_1.storeTasksToLocal)(taskManager.getAllTasks());
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
const displayTaskPane = (taskId) => {
    let task = taskManager.getTask(taskId);
    if (!task)
        return; // Or throw error
    taskPane.textContent = "";
    const titleEl = document.createElement("input");
    titleEl.className = "task-title";
    titleEl.type = "text";
    titleEl.value = task.title;
    titleEl.addEventListener("blur", () => {
        task.title = titleEl.value.toString();
        taskManager.updateTask(taskId, task);
        (0, LocalStorage_1.storeTasksToLocal)(taskManager.getAllTasks());
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
        (0, LocalStorage_1.storeTasksToLocal)(taskManager.getAllTasks());
        renderProjectList();
        renderTaskList();
        displayTaskFilters();
    });
    const statusEl = document.createElement("select");
    statusEl.className = "task-status";
    types_1.statuses.forEach((status) => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        statusEl.append(option);
    });
    statusEl.value = task.status;
    statusEl.addEventListener("blur", () => {
        task.status = statusEl.value;
        taskManager.updateTask(taskId, task);
        (0, LocalStorage_1.storeTasksToLocal)(taskManager.getAllTasks());
        renderProjectList();
        renderTaskList();
        displayTaskFilters();
    });
    const priorityEl = document.createElement("select");
    priorityEl.className = "task-priority";
    types_1.priorities.forEach((priority) => {
        const option = document.createElement("option");
        option.value = priority;
        option.textContent = priority;
        priorityEl.append(option);
    });
    priorityEl.value = task.priority;
    priorityEl.addEventListener("blur", () => {
        task.priority = priorityEl.value;
        taskManager.updateTask(taskId, task);
        (0, LocalStorage_1.storeTasksToLocal)(taskManager.getAllTasks());
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
        (0, LocalStorage_1.storeTasksToLocal)(taskManager.getAllTasks());
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
        (0, LocalStorage_1.storeTasksToLocal)(taskManager.getAllTasks());
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
const displayTasksInProject = (projectId) => {
    let projectName = projectManager.findProjectNameFromId(projectId);
    if (!projectName)
        return; // Or throw error
    displayTasks(projectName, taskManager.getTasksByProject(projectId));
};
const displayTaskFilters = () => {
    filterContainer.textContent = "";
    const allTasksBtn = document.createElement("div");
    allTasksBtn.className = "filter-item";
    allTasksBtn.textContent = "📋 All Tasks";
    const allTasksNumDiv = document.createElement("div");
    allTasksNumDiv.className = "num-tasks";
    allTasksNumDiv.textContent = taskManager.getAllTasks().filter(task => task.status !== "Done").length.toString();
    allTasksBtn.appendChild(allTasksNumDiv);
    allTasksBtn.addEventListener("click", () => {
        currentViewType = "filter";
        currentFilter = "All Tasks";
        const allTasks = taskManager.getAllTasks();
        displayTasks("All Tasks", allTasks);
    });
    const dueTodayBtn = document.createElement("div");
    dueTodayBtn.className = "filter-item";
    dueTodayBtn.textContent = "🔥 Due Today";
    const dueTodayNumDiv = document.createElement("div");
    dueTodayNumDiv.className = "num-tasks";
    dueTodayNumDiv.textContent = taskManager.getTasksDueToday()
        .filter(task => task.status !== "Done")
        .length
        .toString();
    dueTodayBtn.appendChild(dueTodayNumDiv);
    dueTodayBtn.addEventListener("click", () => {
        currentViewType = "filter";
        currentFilter = "Due Today";
        const dueTodayTasks = taskManager.getTasksDueToday();
        displayTasks("Due Today", dueTodayTasks);
    });
    const dueThisWeekBtn = document.createElement("div");
    dueThisWeekBtn.className = "filter-item";
    dueThisWeekBtn.textContent = "🗓️ Due This Week";
    const dueThisWeekNumDiv = document.createElement("div");
    dueThisWeekNumDiv.className = "num-tasks";
    dueThisWeekNumDiv.textContent = taskManager.getTasksDueThisWeek()
        .filter(task => task.status !== "Done")
        .length
        .toString();
    dueThisWeekBtn.appendChild(dueThisWeekNumDiv);
    dueThisWeekBtn.addEventListener("click", () => {
        currentViewType = "filter";
        currentFilter = "Due This Week";
        const dueThisWeekTasks = taskManager.getTasksDueThisWeek();
        displayTasks("Due This Week", dueThisWeekTasks);
    });
    filterContainer.append(allTasksBtn, dueTodayBtn, dueThisWeekBtn);
};
filterContainer.addEventListener("click", () => {
    renderTaskList();
    renderProjectList();
    displayTaskFilters();
});
const listProjects = () => {
    projectManager.addProject({ id: INBOX_ID, name: "🏠 Inbox" });
    let storedProjectArray = (0, LocalStorage_1.retrieveLocalProjects)();
    if (storedProjectArray && storedProjectArray.length > 0) {
        storedProjectArray.forEach((projectData) => {
            projectManager.addProject({ id: projectData.id, name: projectData.name });
        });
    }
    console.table(projectManager);
};
listProjects();
const listTasks = () => {
    let storedTaskArray = (0, LocalStorage_1.retrieveLocalTasks)();
    storedTaskArray.forEach((taskData) => {
        const task = new Task_1.Task({
            id: taskData.id,
            projectId: taskData.projectId,
            status: taskData.status,
            title: taskData.title,
            dueDate: new Date(taskData.dueDate),
            priority: taskData.priority,
            notes: taskData.notes
        });
        taskManager.addTask(task);
    });
    console.table(taskManager.getAllTasks());
};
listTasks();
const initializeLayout = () => {
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
    (0, LocalStorage_1.retrieveLocalProjects)();
    (0, LocalStorage_1.retrieveLocalTasks)();
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
