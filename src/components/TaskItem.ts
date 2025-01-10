import { Task } from '../types/TaskTypes';
import { taskService } from '../services/TaskService';

export function TaskItem(task: Task, onUpdate: () => void, onDelete: () => void): HTMLElement {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.status === 'Done';
  checkbox.addEventListener('change', () => {
    task.status = checkbox.checked ? 'Done' : 'To do';
    taskService.updateTask(task.id, task);
    onUpdate();
  });

  const title = document.createElement('span');
  title.textContent = task.title;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '🗑';
  deleteButton.addEventListener('click', () => {
    taskService.deleteTask(task.id);
    onDelete();
  });

  taskDiv.append(checkbox, title, deleteButton);
  return taskDiv;
}