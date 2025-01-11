import { storeProjectsToLocal, storeTasksToLocal } from "../services/LocalStorage"
import { Project } from '../types/ProjectTypes';
import { Task } from "../types/TaskTypes";
import { Priority, Status } from "../types/AppTypes"

// Seed projects
const seedProjects = [
  { id: 1, name: "🏠 Inbox" }, // Default project
  { id: 2, name: "Work" },
  { id: 3, name: "Personal" },
  { id: 4, name: "Shopping List" },
];

// Seed tasks
const seedTasks = [
  { id: 101, projectId: 1, status: "To do", title: "Organize emails", dueDate: new Date(), priority: "High", notes: "Focus on unread messages" },
  { id: 102, projectId: 2, status: "To do", title: "Finish presentation", dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), priority: "High", notes: "Add charts" },
  { id: 103, projectId: 2, status: "Done", title: "Schedule team meeting", dueDate: new Date(new Date().setDate(new Date().getDate() - 1)), priority: "Low", notes: "" },
  { id: 104, projectId: 3, status: "To do", title: "Plan vacation", dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), priority: "High", notes: "Check flights" },
  { id: 105, projectId: 3, status: "Done", title: "Call mom", dueDate: new Date(new Date().setDate(new Date().getDate() - 3)), priority: "Low", notes: "" },
  { id: 106, projectId: 4, status: "To do", title: "Buy groceries", dueDate: new Date(), priority: "High", notes: "Milk, eggs, bread" },
] as const;

// Seed local storage
export function seedLocalStorage() {
  // Convert seed data to appropriate types
  const projects = seedProjects.map((p) => new Project(p));
  const tasks = seedTasks.map((t) => new Task(t));

  // Store projects and tasks in local storage
  storeProjectsToLocal(projects);
  storeTasksToLocal(tasks);

  console.log('Seed data loaded into local storage!');
}