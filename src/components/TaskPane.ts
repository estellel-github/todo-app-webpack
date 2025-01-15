import { createElement, createInputField, createSelectField, createTextareaField, createLabeledField, safeQuerySelector } from '../utils/domUtils';
import { useAppState } from '../state/AppState';
import { taskService } from '../services/TaskService';
import { Task } from '../types/TaskTypes';
import { storeTasksToLocal } from '../services/LocalStorage';
import { BUTTONS_TXT, DEFAULT_TXT } from '../utils/constants';
import { Priority, Status, priorities, statuses } from '../types/AppTypes';

export function TaskPane(): HTMLElement {
  const taskPaneEl = createElement('div', 'task-pane', '');
  taskPaneEl.id = 'task-pane';
  taskPaneEl.style.display = 'none';

  const titleInput = createInputField('task-title', DEFAULT_TXT.NEW_TASK_TITLE);
  const titleField = createLabeledField('Task Name', titleInput);

  const statusSelect = createSelectField('task-status', ['To do', 'Done'], 'To do');
  const statusField = createLabeledField('Status', statusSelect);

  const prioritySelect = createSelectField('task-priority', ['Low', 'High'], 'High');
  const priorityField = createLabeledField('Priority', prioritySelect);

  const dueDateInput = createInputField('due-date', new Date().toISOString().split('T')[0], 'date');
  const dueDateField = createLabeledField('Due Date', dueDateInput);

  const notesTextarea = createTextareaField('notes', 'Add notes here...');
  const notesField = createLabeledField('Notes', notesTextarea);

  const taskOptionsEl = createElement('div', 'task-options-el');
  taskOptionsEl.id = 'task-options-el';

  const saveTaskButtonEl = createElement('button', 'save-task-btn', BUTTONS_TXT.CREATE_TASK);
  saveTaskButtonEl.id = 'save-task-btn';

  const cancelTaskButtonEl = createElement('button', 'cancel-task-btn', BUTTONS_TXT.CANCEL);
  cancelTaskButtonEl.id = 'cancel-task-btn';

  const deleteTaskButtonEl = createElement('button', 'delete-btn', BUTTONS_TXT.DELETE);
  deleteTaskButtonEl.id = 'delete-task-btn';
  deleteTaskButtonEl.style.display = 'none';

  taskPaneEl.appendChild(titleField);
  taskPaneEl.appendChild(statusField);
  taskPaneEl.appendChild(priorityField);
  taskPaneEl.appendChild(dueDateField);
  taskPaneEl.appendChild(notesField);
  taskOptionsEl.appendChild(saveTaskButtonEl);
  taskOptionsEl.appendChild(deleteTaskButtonEl);
  taskOptionsEl.appendChild(cancelTaskButtonEl);
  taskPaneEl.appendChild(taskOptionsEl);

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
      status: statusSelect.value as Status,
      title: titleInput.value,
      dueDate: new Date(dueDateInput.value),
      priority: prioritySelect.value as Priority,
      notes: notesTextarea.value,
    };

    if (activeTaskId) {
      const updatedTask = new Task(taskDetails);
      if (!updatedTask.title) {
        updatedTask.title = taskService.getTask(activeTaskId)?.title || DEFAULT_TXT.DEFAULT_TASK_TITLE;
      }

      taskService.updateTask(activeTaskId, updatedTask);
    } else {
      const newTask = new Task(taskDetails)
      if (!newTask.title) {
        newTask.title = DEFAULT_TXT.NEW_TASK_TITLE;
      }
      taskService.addTask(newTask);
      storeTasksToLocal(taskService.getAllTasks());
    }
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
        saveTaskButtonEl.textContent = BUTTONS_TXT.SAVE;
      }
    } else {
      titleInput.value = 'New Task';
      statusSelect.value = statuses[0]; // To Do
      prioritySelect.value = priorities[1]; // High
      dueDateInput.value = new Date().toISOString().split('T')[0];
      notesTextarea.value = DEFAULT_TXT.NOTES_TXT;
      deleteTaskButtonEl.style.display = 'none';
      saveTaskButtonEl.textContent = BUTTONS_TXT.CREATE_TASK;
    }
    taskPaneEl.style.display = 'block';
  };

  const handleClickOutside = (event: MouseEvent) => {
    let isModalOpen = useAppState.getState().isModalOpen;

    if (taskPaneEl.contains(event.target as Node)) {
      return;
    }

    if (!taskPaneEl.contains(event.target as Node) && taskPaneEl.style.display === 'block' && !isModalOpen) {
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
    const { isTaskPaneOpen } = useAppState.getState();

    if (isTaskPaneOpen) {
      populateTaskPane();
      safeQuerySelector('#task-list-container').classList.add("blurred");
    }
  });

  return taskPaneEl;
}