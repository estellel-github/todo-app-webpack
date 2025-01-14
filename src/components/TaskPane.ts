import { createElement, createInputField, createSelectField, createTextareaField, createLabeledField, safeQuerySelector } from '../utils/domUtils';
import { useAppState } from '../state/AppState';
import { taskService } from '../services/TaskService';
import { Task } from '../types/TaskTypes';
import { storeTasksToLocal } from '../services/LocalStorage';

export function TaskPane(): HTMLElement {
  const taskPaneEl = createElement('div', 'task-pane', '');
  taskPaneEl.id = 'task-pane';
  taskPaneEl.style.display = 'none';

  const titleInput = createInputField('task-title', 'New Task');
  const titleField = createLabeledField('Task Name', titleInput);

  const statusSelect = createSelectField('task-status', ['To do', 'Done'], 'To do');
  const statusField = createLabeledField('Status', statusSelect);

  const prioritySelect = createSelectField('task-priority', ['Low', 'High'], 'High');
  const priorityField = createLabeledField('Priority', prioritySelect);

  const dueDateInput = createInputField('due-date', new Date().toISOString().split('T')[0], 'date');
  const dueDateField = createLabeledField('Due Date', dueDateInput);

  const notesTextarea = createTextareaField('notes', 'Add notes here...');
  const notesField = createLabeledField('Notes', notesTextarea);

  const saveTaskButtonEl = createElement('button', 'save-task-btn', 'Create Task');
  saveTaskButtonEl.id = 'save-task-btn';

  const cancelTaskButtonEl = createElement('button', 'cancel-task-btn', 'Cancel');
  cancelTaskButtonEl.id = 'cancel-task-btn';

  const deleteTaskButtonEl = createElement('button', 'delete-task-btn', '🗑 Delete Task');
  deleteTaskButtonEl.id = 'delete-task-btn';
  deleteTaskButtonEl.style.display = 'none';

  taskPaneEl.appendChild(titleField);
  taskPaneEl.appendChild(statusField);
  taskPaneEl.appendChild(priorityField);
  taskPaneEl.appendChild(dueDateField);
  taskPaneEl.appendChild(notesField);
  taskPaneEl.appendChild(saveTaskButtonEl);
  taskPaneEl.appendChild(cancelTaskButtonEl);
  taskPaneEl.appendChild(deleteTaskButtonEl);

  const hideTaskPane = () => {
    const activeTaskId = useAppState.getState().activeTaskId;
    taskPaneEl.style.display = 'none';
    useAppState.getState().toggleTaskPane(false, activeTaskId);
    safeQuerySelector('#task-list-container').classList.remove("blurred");
  };

  const createOrUpdateTask = () => {
    const activeTaskId = useAppState.getState().activeTaskId;

    const taskDetails = {
      id: activeTaskId || Date.now(),
      projectId: useAppState.getState().activeProjectId || 1,
      status: statusSelect.value as 'To do' | 'Done',
      title: titleInput.value,
      dueDate: new Date(dueDateInput.value),
      priority: prioritySelect.value as 'Low' | 'High',
      notes: notesTextarea.value,
    };

    if (activeTaskId) {
      const updatedTask = new Task(taskDetails);
      if (!updatedTask.title) {
        updatedTask.title = taskService.getTask(activeTaskId)?.title || "Default Task Title";
      }

      taskService.updateTask(activeTaskId, updatedTask);
    } else {
      const newTask = new Task(taskDetails)
      if (!newTask.title) {
        newTask.title = "New Task";
      }
      taskService.addTask(newTask);
      storeTasksToLocal(taskService.getAllTasks());
    }
    console.log("Triggering state update: task created or edited");
    useAppState.getState().triggerUpdate();
    hideTaskPane();
  };

  const deleteTask = (taskId: number) => {
    useAppState.getState().setActiveTaskId(taskId);
    useAppState.getState().toggleModal(true, 'task-deletion');
  };

  const populateTaskPane = () => {
    const activeTaskId = useAppState.getState().activeTaskId;
    if (activeTaskId) {
      const task = taskService.getTask(activeTaskId);
      if (task) {
        titleInput.value = task.title;
        statusSelect.value = task.status;
        prioritySelect.value = task.priority;
        dueDateInput.value = task.dueDate.toISOString().split('T')[0];
        notesTextarea.value = task.notes;
        deleteTaskButtonEl.style.display = 'block';
        saveTaskButtonEl.textContent = 'Save Task';
      }
    } else {
      titleInput.value = 'New Task';
      statusSelect.value = 'To do';
      prioritySelect.value = 'High';
      dueDateInput.value = new Date().toISOString().split('T')[0];
      notesTextarea.value = 'Add notes here...';
      deleteTaskButtonEl.style.display = 'none';
      saveTaskButtonEl.textContent = 'Create Task';
    }
    taskPaneEl.style.display = 'block';
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!taskPaneEl.contains(event.target as Node) && taskPaneEl.style.display === 'block') {
      hideTaskPane();
    }
    safeQuerySelector('#task-list-container').classList.remove("blurred");
  };

  saveTaskButtonEl.addEventListener('click', createOrUpdateTask);
  cancelTaskButtonEl.addEventListener('click', () => {
    hideTaskPane();
  });
  deleteTaskButtonEl.addEventListener('click', () => {
    const taskId = useAppState.getState().activeTaskId;
    if (taskId) {
      deleteTask(taskId);
    } else {
    }
  });

  document.addEventListener('mousedown', handleClickOutside);

  useAppState.getState().subscribeToStateChange(() => {
    if (useAppState.getState().isTaskPaneOpen === true) {
      populateTaskPane();
      safeQuerySelector('#task-list-container').classList.add("blurred");
    }
  });

  return taskPaneEl;
}