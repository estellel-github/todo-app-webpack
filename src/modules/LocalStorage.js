import { Task } from "./Task";

function storeToLocal(allTasks) {
  const taskCatalogJson = JSON.stringify(allTasks);
  localStorage.setItem("taskCatalog", taskCatalogJson);
}

function retrieveAllTasks() {
  const storedCatalogJson = localStorage.getItem("taskCatalog");
  let allTasks = [];
  if (storedCatalogJson && storedCatalogJson.length !== 0) {
    const tempTasks = JSON.parse(storedCatalogJson);
    allTasks = tempTasks.map(taskData => new Task(
      taskData._id,
      taskData._projectId,
      taskData._status,
      taskData._title,
      taskData._desc,
      new Date(taskData._dueDate),
      taskData._priority,
      taskData._notes,
      taskData._checklist
    ));
  } else {
    console.log("No tasks found in Local Storage.");
  }
  return allTasks;
}