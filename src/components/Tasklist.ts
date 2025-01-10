import { Task } from '../types/TaskTypes';
import { TaskItem } from './TaskItem';

export function TaskList(tasks: Task[], onUpdate: () => void): HTMLElement {
  const taskListDiv = document.createElement('div');
  taskListDiv.className = 'task-list';

  tasks.forEach((task) => {
    const taskElement = TaskItem(task, onUpdate, () => onUpdate());
    taskListDiv.appendChild(taskElement);
  });

  return taskListDiv;
}