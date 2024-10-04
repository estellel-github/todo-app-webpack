import "./styles/styles.css";
import { Project } from "./modules/Project";
import { Task } from "./modules/Task";
import { ProjectManager } from "./modules/ProjectManager";
import { TaskManager } from "./modules/TaskManager";
import { storedToLocal, retrieveAllTasks } from "./modules/LocalStorage";

let activeProjectId = 0;

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

const projectManager = new ProjectManager();
projectManager.createInbox();
const taskManager = new TaskManager();

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
      projectManager.addProject(projectName);
      displayProjectList();

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

const displayProjectList = () => {
  clearProjectList();
  const projectListHeader = document.createElement("h2");
  projectListHeader.textContent = "Projects";
  projectListDiv.append(projectListHeader);

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
      activeProjectId = project.id;
      displayTasksInProject(activeProjectId);
    });

    const projectNameInput = document.createElement("input");
    projectNameInput.type = "text";
    projectNameInput.value = project.name;
    projectNameInput.style.display = "none";
    projectItemDiv.insertBefore(projectNameInput, numTasksDiv);

    if (project.id !== 0) {
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
  deletionMsg.textContent = "This project and all its tasks will be deleted permanently.";

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
    displayProjectList();
    displayTasksInProject(0);
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

  if (tasks.length === 0) {
    const emptyProjectMsg = document.createElement("div");
    emptyProjectMsg.className = "empty-list-msg";
    emptyProjectMsg.textContent = "This list is empty. Add a new task!";
    taskListDiv.append(emptyProjectMsg);
    return;
  }
  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.textContent = task.title;
    taskItem.addEventListener("click", (e) => {
      e.stopPropagation();
      displayTaskModal(task.id);
    });
    taskListDiv.append(taskItem);
    mainContainer.append(taskListDiv);
  });
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
  ["To do", "In Progress", "Done"].forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    statusEl.append(option);
  });
  statusEl.value = defaultStatus;

  const priorityEl = document.createElement("select");
  priorityEl.className = "task-priority";
  ["Low", "Medium", "High"].forEach((priority) => {
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
      activeProjectId,
      statusEl.value,
      titleEl.value,
      new Date(dueDateEl.value),
      priorityEl.value,
      notesEl.value
    );

    taskManager.addTask(newTask);
    displayProjectList();
    displayTasksInProject(activeProjectId);
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
    displayProjectList();
    displayTasksInProject(activeProjectId);
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
    displayTasksInProject(activeProjectId);
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
    displayTasksInProject(newProjectId);
  });

  const statusEl = document.createElement("select");
  statusEl.className = "task-status";
  ["To do", "In Progress", "Done"].forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    statusEl.append(option);
  });
  statusEl.value = task.status;
  statusEl.addEventListener("blur", () => {
    task.status = statusEl.value;
    taskManager.updateTask(taskId, task);
    displayTasksInProject(activeProjectId);
  });

  const priorityEl = document.createElement("select");
  priorityEl.className = "task-priority";
  ["Low", "Medium", "High"].forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority;
    priorityEl.append(option);
  });
  priorityEl.value = task.priority;
  priorityEl.addEventListener("blur", () => {
    task.priority = priorityEl.value;
    taskManager.updateTask(taskId, task);
    displayTasksInProject(activeProjectId);
  });

  const dueDateEl = document.createElement("input");
  dueDateEl.className = "due-date";
  dueDateEl.type = "date";
  dueDateEl.value = task.dueDate.toISOString().split("T")[0];
  dueDateEl.addEventListener("blur", () => {
    task.dueDate = new Date(dueDateEl.value);
    taskManager.updateTask(taskId, task);
    displayTasksInProject(activeProjectId);
  });

  const notesEl = document.createElement("textarea");
  notesEl.className = "notes";
  notesEl.value = task.notes;
  notesEl.addEventListener("blur", () => {
    task.notes = notesEl.value;
    taskManager.updateTask(taskId, task);
    displayTasksInProject(activeProjectId);
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
  const project = projectManager.findProjectById(projectId);
  displayTasks(project.name, taskManager.getTasksByProject(projectId));
};

const displayTasksDueToday = () => {
  displayTasks("Due Today", taskManager.getTasksDueToday());
};

const displayTasksDueThisWeek = () => {
  displayTasks("Due This Week", taskManager.getTasksDueThisWeek());
};

const projectArray = [];
const testProjectArray = ["Work", "Home", "Hobbies", "Learning"];

const testTaskArray = [
  {
    _projectId: 1,
    _status: "To do",
    _title: "Revamp Homepage",
    _desc: "Redesign the homepage to improve UX",
    _dueDate: "2024-10-05",
    _priority: "High",
    _notes: "Focus on mobile first",
    _checklist: ["Create wireframes", "Approve designs", "Implement"],
  },
  {
    _projectId: 2,
    _status: "Done",
    _title: "Garden Spring Cleaning",
    _desc: "Organize and clean the garden shed",
    _dueDate: "2024-10-20",
    _priority: "Low",
    _notes: "Check tool conditions",
    _checklist: ["Sort tools", "Dispose of old chemicals", "Sweep out shed"],
  },
  {
    _projectId: 3,
    _status: "In Progress",
    _title: "Build RC Plane",
    _desc: "Assemble the new RC plane kit",
    _dueDate: "2024-10-15",
    _priority: "High",
    _notes: "Verify all parts are present",
    _checklist: [
      "Inventory parts",
      "Read assembly instructions",
      "Begin assembly",
    ],
  },
  {
    _projectId: 4,
    _status: "In Progress",
    _title: "Learn React",
    _desc: "Complete the advanced React course",
    _dueDate: "2024-10-01",
    _priority: "High",
    _notes: "Focus on hooks and context",
    _checklist: [
      "Finish course videos",
      "Complete hands-on project",
      "Review course material",
    ],
  },
  {
    _projectId: 1,
    _status: "To do",
    _title: "Staff Training Session",
    _desc: "Organize a training session on data security",
    _dueDate: "2024-11-10",
    _priority: "Low",
    _notes: "Coordinate with IT department",
    _checklist: ["Prepare materials", "Schedule IT speaker", "Send invites"],
  },
  {
    _projectId: 2,
    _status: "To do",
    _title: "Remodel Kitchen",
    _desc: "Plan and execute a kitchen remodel",
    _dueDate: "2024-12-25",
    _priority: "High",
    _notes: "Finalize design by next month",
    _checklist: [
      "Choose new appliances",
      "Select countertops",
      "Hire contractor",
    ],
  },
  {
    _projectId: 3,
    _status: "Done",
    _title: "Photography Outing",
    _desc: "Organize a weekend photography trip",
    _dueDate: "2024-09-30",
    _priority: "Low",
    _notes: "Focus on landscape shots",
    _checklist: ["Select location", "Check weather", "Pack gear"],
  },
  {
    _projectId: 4,
    _status: "In Progress",
    _title: "Study Algebra",
    _desc: "Prepare for upcoming algebra exam",
    _dueDate: "2024-10-12",
    _priority: "High",
    _notes: "Focus on quadratic equations",
    _checklist: [
      "Review textbook",
      "Solve practice problems",
      "Attend study group",
    ],
  },
  {
    _projectId: 1,
    _status: "To do",
    _title: "Annual Report",
    _desc: "Compile the annual performance report",
    _dueDate: "2024-11-01",
    _priority: "High",
    _notes: "Include all departmental summaries",
    _checklist: [
      "Collect department data",
      "Draft report",
      "Review with executives",
    ],
  },
  {
    _projectId: 2,
    _status: "Done",
    _title: "Install Home Security System",
    _desc: "Select and install a new home security system",
    _dueDate: "2024-09-18",
    _priority: "Low",
    _notes: "Ensure all entrances are covered",
    _checklist: [
      "Research systems",
      "Purchase equipment",
      "Install by professionals",
    ],
  },
  {
    _projectId: 3,
    _status: "To do",
    _title: "Painting Class",
    _desc: "Attend a local painting class",
    _dueDate: "2024-10-31",
    _priority: "Low",
    _notes: "Choose acrylics or oils",
    _checklist: [
      "Register for class",
      "Purchase supplies",
      "Attend first session",
    ],
  },
  {
    _projectId: 4,
    _status: "In Progress",
    _title: "Python Programming",
    _desc: "Complete the intermediate Python course",
    _dueDate: "2024-10-20",
    _priority: "High",
    _notes: "Emphasize data analysis",
    _checklist: ["Complete modules", "Work on project", "Pass final exam"],
  },
  {
    _projectId: 1,
    _status: "Done",
    _title: "Client Presentation",
    _desc: "Prepare and deliver the Q4 client presentation",
    _dueDate: "2024-09-25",
    _priority: "High",
    _notes: "Focus on new services",
    _checklist: ["Draft slides", "Review with team", "Practice presentation"],
  },
  {
    _projectId: 2,
    _status: "To do",
    _title: "Family Reunion",
    _desc: "Plan the annual family reunion",
    _dueDate: "2024-10-29",
    _priority: "Low",
    _notes: "Send out invitations by end of month",
    _checklist: ["Create guest list", "Send invitations", "Plan catering"],
  },
  {
    _projectId: 3,
    _status: "In Progress",
    _title: "Rock Climbing",
    _desc: "Train for the upcoming climbing competition",
    _dueDate: "2024-10-25",
    _priority: "High",
    _notes: "Increase training sessions",
    _checklist: [
      "Practice regularly",
      "Hire a coach",
      "Join local climbing club",
    ],
  },
  {
    _projectId: 4,
    _status: "In Progress",
    _title: "Learn Spanish",
    _desc: "Achieve conversational fluency in Spanish",
    _dueDate: "2024-12-30",
    _priority: "High",
    _notes: "Practice daily",
    _checklist: [
      "Daily Duolingo lessons",
      "Weekly tutor sessions",
      "Spanish conversation meetup",
    ],
  },
  {
    _projectId: 1,
    _status: "To do",
    _title: "Upgrade Network Infrastructure",
    _desc:
      "Upgrade the office network infrastructure to support new technologies",
    _dueDate: "2024-11-15",
    _priority: "High",
    _notes: "Minimize downtime",
    _checklist: [
      "Evaluate current hardware",
      "Select new hardware",
      "Schedule installation",
    ],
  },
  {
    _projectId: 2,
    _status: "Done",
    _title: "Decorate Living Room",
    _desc: "Redecorate the living room with a new theme",
    _dueDate: "2024-09-22",
    _priority: "Low",
    _notes: "Decide between modern or rustic",
    _checklist: [
      "Choose color scheme",
      "Purchase furniture",
      "Arrange delivery",
    ],
  },
  {
    _projectId: 3,
    _status: "Done",
    _title: "Complete Knitting Project",
    _desc: "Finish knitting the winter scarf project",
    _dueDate: "2024-11-30",
    _priority: "Low",
    _notes: "Prepare for holiday gifts",
    _checklist: ["Select yarn", "Knit main piece", "Add fringe ends"],
  },
  {
    _projectId: 4,
    _status: "To do",
    _title: "Online Course Creation",
    _desc: "Develop an online course on web development",
    _dueDate: "2024-12-15",
    _priority: "High",
    _notes: "Structure course into modules",
    _checklist: ["Outline course", "Record video lectures", "Publish course"],
  },
];

const listProjects = (() => {
  for (let i = 0; i < testProjectArray.length; i++) {
    projectManager.addProject(testProjectArray[i]);
  }
  console.table(projectManager);
})();

const listTasks = (() => {
  testTaskArray.forEach((taskData) => {
    const task = new Task(
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
})();

const loadPage = (() => {
  sidebar.append(projectListDiv);
  sidebar.append(newProjectDiv);
  moduleContentDiv.append(sidebar);
  mainContainer.append(newTaskButton);
  moduleContentDiv.append(mainContainer);
  moduleContentDiv.append(taskListDiv);
  displayProjectList();
  displayTasksInProject(activeProjectId);
  displayNewProjectContainer();
  moduleContentDiv.append(projectModal);
})();

// TO DO:

// MOVE SET CHOICES (Status / Priority) to dynamic array

// OPTIMIZE MODAL CLOSING (selection and setting to display none)


// NICE TO HAVE:

// ENABLE DRAG-DROP TO MOVE TO OTHER PROJECT

// ADD FILTER IN EACH TASK LIST:
// -- TO DO are shown
// -- COMPLETED are hidden but can be revealed
