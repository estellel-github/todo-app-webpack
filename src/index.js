import "./styles/styles.css";
import { Project } from "./modules/Project";
import { Task } from "./modules/Task";
import { ProjectManager } from "./modules/ProjectManager";
import { TaskManager } from "./modules/TaskManager";
import { storedToLocal, retrieveAllTasks } from "./modules/LocalStorage";

const moduleContentDiv = document.querySelector("#module-content");

const sidebar = document.createElement("div");
sidebar.className = "sidebar";

const projectListDiv = document.createElement("div");
projectListDiv.className = "project-list";

const mainContainer = document.createElement("div");
mainContainer.className = "main-container";

const taskListDiv = document.createElement("div");
taskListDiv.className = "task-list";

const projectManager = new ProjectManager();
const taskManager = new TaskManager();

// TEMPLATE PROJECT AND TASK LIST

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

const Projects = (() => {
  projectManager.createInbox();
  for (let i = 0; i < testProjectArray.length; i++) {
    projectManager.addProject(testProjectArray[i]);
  }
  console.table(projectManager);
})();

const Tasks = (() => {
  testTaskArray.forEach((taskData) => {
    const task = new Task(
      taskData._projectId,
      taskData._status,
      taskData._title,
      taskData._desc,
      new Date(taskData._dueDate),
      taskData._priority,
      taskData._notes,
      taskData._checklist
    );
    taskManager.addTask(task);
  });
  console.table(taskManager.getAllTasks());
})();

const clearProjectList = () => {
  projectListDiv.textContent = "";
};

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

    const deleteIconDiv = document.createElement("div");
    deleteIconDiv.className = "delete-icon";
    deleteIconDiv.textContent = "🗑️";
    projectItemDiv.append(deleteIconDiv);

    projectItemDiv.addEventListener("click", (e) =>
      listTasksInProject(project.id)
    );

    sidebar.append(projectListDiv);
  });
};

const newProjectContainer = (() => {
  const newProjectButton = document.createElement("button");
  newProjectButton.className = "new-project-btn";
  newProjectButton.textContent = "+ Add project";
  sidebar.append(newProjectButton);
  console.log("test");
})();

function clearTaskList() {
  taskListDiv.textContent = "";
}

const displayTasks = (tabName, tasks) => {
  clearTaskList();
  const taskListHeader = document.createElement("h2");
  taskListHeader.textContent = tabName;
  taskListDiv.append(taskListHeader);
  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.textContent = task.title;
    taskListDiv.append(taskItem);
    mainContainer.append(taskListDiv);
  });
};

const listInboxTasks = () => {
  displayTasks("Inbox", taskManager.getTasksByProject(0));
};

const listTasksInProject = (projectId) => {
  displayTasks(
    projectManager.findProjectById(projectId).name,
    taskManager.getTasksByProject(projectId)
  );
};

const listTasksDueToday = () => {
  displayTasks("Due Today", taskManager.getTasksDueToday());
};

const listTasksDueThisWeek = () => {
  displayTasks("Due This Week", taskManager.getTasksDueThisWeek());
};

const loadPage = (() => {
  moduleContentDiv.append(sidebar);
  moduleContentDiv.append(mainContainer);
  displayProjectList();
  listTasksInProject(2);
})();

// ADD UI TO DELETE PROJECT
// ADD UI TO ADD PROJECT

// ADD UI TO CREATE TASK
// ADD UI TO MOVE TASK
// ADD UI TO DELETE TASK
// ADD UI TO EDIT TASK

// MAYBE: ADD FILTER IN EACH TASK LIST:
// -- TO DO are shown
// -- COMPLETED are hidden but can be revealed
