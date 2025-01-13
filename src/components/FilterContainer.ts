import { createElement, clearContent } from '../utils/domUtils';
import { useAppState } from '../state/AppState';
import { taskService } from '../services/TaskService';
import { filters, Filter } from '../types/AppTypes';

export function FilterContainer(): HTMLElement {
  const filterContainerEl = createElement('div', 'filter-container', '');
  filterContainerEl.id = 'filter-container';

  const renderFilters = () => {
    clearContent(filterContainerEl);

    filters.forEach((filter: Filter) => {
      const filterItemEl = createElement('div', 'filter-item', '');
      filterItemEl.id = `filter-item-${filter}`;

      const filterInfoEl = createElement('div', 'filter-info', '');
      const filterNameEl = createElement('div', 'filter-info', filter)

      const numTasksEl = createElement('div', 'num-tasks', '');
      numTasksEl.id = `num-tasks-${filter}`;

      const tasks = filter === '📋 All Tasks'
        ? taskService.getAllTasks()
        : filter === '🔥 Due Today'
          ? taskService.getTasksDueToday()
          : taskService.getTasksDueThisWeek();

      let taskCount: number = tasks.filter((task) => task.status === 'To do').length;
      numTasksEl.textContent = taskCount.toString();

      filterItemEl.addEventListener('click', () => {
        useAppState.getState().setActiveProjectId(null);
        useAppState.getState().setFilter(filter);
        useAppState.getState().setViewType('filter');
        useAppState.getState().triggerUpdate();
      });

      filterInfoEl.appendChild(filterNameEl);
      filterInfoEl.appendChild(numTasksEl);
      filterItemEl.appendChild(filterInfoEl);
      filterContainerEl.appendChild(filterItemEl);
    });
  };

  useAppState.getState().subscribeToStateChange(() => {
    renderFilters();
  });

  renderFilters();

  return filterContainerEl;
}