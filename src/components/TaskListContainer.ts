import { createElement, clearContent } from '../utils/domUtils';
import { useAppState } from '../state/AppState';
import { taskService } from '../services/TaskService';
import { projectService } from '../services/ProjectService';

export function TaskListContainer(): HTMLElement {
  const taskListContainerEl = createElement('div', 'task-list-container', '');
  taskListContainerEl.id = 'task-list-container';

  const taskListHeaderEl = createElement('div', 'task-list-header', '');
  taskListHeaderEl.id = 'task-list-header';

  const newTaskBtnEl = createElement('button', 'new-task-btn', '+ New Task');
  newTaskBtnEl.id = 'new-task-btn';
  newTaskBtnEl.style.display = 'none';

  const taskListEl = createElement('div', 'task-list', '');
  taskListEl.id = 'task-list';

  const collapsibleHeaderEl = createElement('h3', 'collapsible-header', '▶ Done');
  collapsibleHeaderEl.id = 'collapsible-header';
  collapsibleHeaderEl.style.cursor = 'pointer';

  const doneTasksContainer = createElement('div', 'done-tasks-container', '');
  doneTasksContainer.style.display = 'none';

  collapsibleHeaderEl.addEventListener("click", () => {
    collapsibleHeaderEl.textContent =
      collapsibleHeaderEl.textContent === "▼ Done" ? "▶ Done" : "▼ Done";
    doneTasksContainer.style.display =
      doneTasksContainer.style.display === "none" ? "block" : "none";
  });

  taskListContainerEl.appendChild(newTaskBtnEl);
  taskListContainerEl.appendChild(taskListHeaderEl);
  taskListContainerEl.appendChild(taskListEl);
  taskListContainerEl.appendChild(collapsibleHeaderEl);
  taskListContainerEl.appendChild(doneTasksContainer);

  const renderTaskList = () => {
    const { activeProjectId, currentFilter } = useAppState.getState();
    const isProjectView = activeProjectId !== null;

    newTaskBtnEl.style.display = isProjectView ? 'block' : 'none';

    const tasks = isProjectView
      ? taskService.getTasksByProject(activeProjectId)
      : currentFilter === '📋 All Tasks'
        ? taskService.getAllTasks()
        : currentFilter === '🔥 Due Today'
          ? taskService.getTasksDueToday()
          : taskService.getTasksDueThisWeek();

    taskListHeaderEl.textContent = isProjectView
      ? projectService.findProjectNameFromId(activeProjectId) || 'Unknown Project'
      : currentFilter;

    clearContent(taskListEl);
    clearContent(doneTasksContainer);

    const doneTasks = tasks.filter((task) => task.status === 'Done');
    const toDoTasks = tasks.filter((task) => task.status === 'To do');

    toDoTasks.forEach((task) => {
      const taskItemEl = createElement('div', 'task-item', task.title);
      taskItemEl.classList.add('to-do');
      taskItemEl.id = `task-item-${task.id}`;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = false;
      checkbox.addEventListener('click', () => {
        task.status = 'Done';
        taskService.updateTask(task.id, task);
        useAppState.getState().triggerUpdate();
      });

      taskItemEl.prepend(checkbox);
      taskListEl.appendChild(taskItemEl);
    });

    if (doneTasks.length > 0) {
      collapsibleHeaderEl.style.display = 'block';
      doneTasks.forEach((task) => {
        const taskItemEl = createElement('div', 'task-item', task.title);
        taskItemEl.classList.add('done');
        taskItemEl.id = `task-item-${task.id}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = true;
        checkbox.addEventListener('click', () => {
          task.status = 'To do';
          taskService.updateTask(task.id, task);
          useAppState.getState().triggerUpdate();
        });

        taskItemEl.prepend(checkbox);
        doneTasksContainer.appendChild(taskItemEl);
      });
    } else {
      collapsibleHeaderEl.style.display = 'none';
    }
  };

  useAppState.getState().subscribeToStateChange(() => {
    renderTaskList();
  });

  renderTaskList();

  return taskListContainerEl;
}