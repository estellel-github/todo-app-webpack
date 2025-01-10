import { taskService } from "../services/TaskService";
import { projectService } from "../services/ProjectService";
import { storeTasksToLocal } from "../services/LocalStorage";
import { createInputField, createSelectField, createTextareaField } from "../utils/domUtils";
import { useAppState } from "../state/AppState";

const toggleTaskPane = (shouldShow: boolean) => {
  const taskPane = document.querySelector('.task-pane') as HTMLElement;
  if (taskPane) {
    taskPane.style.display = shouldShow ? 'block' : 'none';
  }
};

/**
 * Creates a Task Pane for editing or creating tasks.
 * @param taskId - The ID of the task to edit, or `null` to create a new task.
 * @param onUpdate - Callback function to trigger re-renders after updates.
 * @returns HTMLElement representing the Task Pane.
 */
export function TaskPane(taskId: number | null, onUpdate: () => void): HTMLElement {
  const taskPane = document.createElement("div");
  taskPane.className = "task-pane";

  const { activeTaskId, toggleTaskPane, activeProjectId } = useAppState.getState();

  // Helper to close the task pane
  const closeTaskPane = () => {
    useAppState.getState().toggleTaskPane(false);;
    toggleTaskPane()
    taskPane.innerHTML = ""; // Clear content
  };

  if (taskId) {
    // EDITING AN EXISTING TASK
    const task = taskService.getTask(taskId);
    if (!task) return taskPane;

    // Populate fields for editing
    const titleEl = createInputField("task-title", task.title);
    const statusEl = createSelectField("task-status", ["To do", "Done"], task.status);
    const priorityEl = createSelectField("task-priority", ["Low", "High"], task.priority);
    const dueDateEl = createInputField("due-date", task.dueDate.toISOString().split("T")[0], "date");
    const notesEl = createTextareaField("notes", task.notes);

    // Delete button
    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.className = "delete-task-btn";
    deleteTaskBtn.textContent = "🗑 Delete Task";
    deleteTaskBtn.addEventListener("click", () => {
      taskService.deleteTask(taskId);
      storeTasksToLocal(taskService.getAllTasks());
      onUpdate();
      closeTaskPane();
    });

    // Save on blur
    titleEl.addEventListener("blur", () => {
      task.title = titleEl.value;
      taskService.updateTask(taskId, task);
      storeTasksToLocal(taskService.getAllTasks());
      onUpdate();
    });

    statusEl.addEventListener("change", () => {
      task.status = statusEl.value as "To do" | "Done";
      taskService.updateTask(taskId, task);
      storeTasksToLocal(taskService.getAllTasks());
      onUpdate();
    });

    priorityEl.addEventListener("change", () => {
      task.priority = priorityEl.value as "Low" | "High";
      taskService.updateTask(taskId, task);
      storeTasksToLocal(taskService.getAllTasks());
      onUpdate();
    });

    dueDateEl.addEventListener("blur", () => {
      task.dueDate = new Date(dueDateEl.value);
      taskService.updateTask(taskId, task);
      storeTasksToLocal(taskService.getAllTasks());
      onUpdate();
    });

    notesEl.addEventListener("blur", () => {
      task.notes = notesEl.value;
      taskService.updateTask(taskId, task);
      storeTasksToLocal(taskService.getAllTasks());
      onUpdate();
    });

    // Append all fields
    taskPane.append(titleEl, statusEl, priorityEl, dueDateEl, notesEl, deleteTaskBtn);
  } else {
    // CREATING A NEW TASK
    const defaultTask = {
      title: "New Task",
      status: "To do",
      priority: "High",
      dueDate: new Date().toISOString().split("T")[0],
      notes: "",
    };

    const titleEl = createInputField("task-title", defaultTask.title);
    const statusEl = createSelectField("task-status", ["To do", "Done"], defaultTask.status);
    const priorityEl = createSelectField("task-priority", ["Low", "High"], defaultTask.priority);
    const dueDateEl = createInputField("due-date", defaultTask.dueDate, "date");
    const notesEl = createTextareaField("notes", defaultTask.notes);

    const saveButton = document.createElement("button");
    saveButton.className = "save-task-btn";
    saveButton.textContent = "Create Task";
    saveButton.addEventListener("click", () => {
      const newTask = {
        _id: null,
        _projectId: activeProjectId,
        _title: titleEl.value,
        _status: statusEl.value as "To do" | "Done",
        _priority: priorityEl.value as "Low" | "High",
        _dueDate: new Date(dueDateEl.value),
        _notes: notesEl.value,
      };

      taskService.addTask(newTask);
      storeTasksToLocal(taskService.getAllTasks());
      onUpdate();
      closeTaskPane();
    });

    const cancelButton = document.createElement("button");
    cancelButton.className = "cancel-task-btn";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", closeTaskPane);

    // Append all fields
    taskPane.append(titleEl, statusEl, priorityEl, dueDateEl, notesEl, saveButton, cancelButton);
  }

  return taskPane;
}



const clearHideTaskPane = () => {
  taskPane.textContent = "";
  createTaskDiv.textContent = "";
  toggleTaskPane(false);
};