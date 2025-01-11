import { createElement } from '../utils/domUtils';
import { useAppState } from '../state/AppState';
import { projectService } from '../services/ProjectService';
import { taskService } from '../services/TaskService';
import { Project } from '../types/ProjectTypes';
import { storeProjectsToLocal } from '../services/LocalStorage';
import { MESSAGES } from "../utils/constants"

export function ProjectOptions(project: Project): HTMLElement {
  const projectOptionsEl = createElement('div', 'project-options', '');
  projectOptionsEl.id = `project-options-${project.id}`;

  let isEditing = false;

  const inputContainer = createElement('div', 'project-name-input-container');
  inputContainer.style.display = 'none';

  const projectNameInputEl = createElement('input', 'project-name-input', '') as HTMLInputElement;
  projectNameInputEl.type = 'text';
  projectNameInputEl.value = project.name;
  inputContainer.appendChild(projectNameInputEl);

  const editBtn = createElement('button', 'edit-btn', '✏️');
  const saveBtn = createElement('button', 'save-btn display-none', '💾');
  const deleteBtn = createElement('button', 'delete-btn', '🗑️');

  const enterEditMode = () => {
    isEditing = true;
    const projectNameEl = document.getElementById(`project-name-${project.id}`);
    const projectInfoEl = document.getElementById(`project-info-${project.id}`);

    if (projectNameEl && projectInfoEl) {
      projectNameEl.style.display = 'none';

      const numTasksEl = projectInfoEl.querySelector('.num-tasks');
      if (numTasksEl) {
        inputContainer.style.display = 'block';
        projectInfoEl.insertBefore(inputContainer, numTasksEl);
      }

      projectNameInputEl.focus();

      editBtn.classList.add('display-none');
      saveBtn.classList.remove('display-none');
    }
  };

  const exitEditMode = () => {
    isEditing = false;
    const projectNameEl = document.getElementById(`project-name-${project.id}`);

    if (projectNameEl) {
      projectNameEl.style.display = 'block';
      inputContainer.style.display = 'none';
      if (inputContainer.parentNode) {
        inputContainer.parentNode.removeChild(inputContainer);
      }

      editBtn.classList.remove('display-none');
      saveBtn.classList.add('display-none');
    }
  };

  const saveNewName = () => {
    const newName = projectNameInputEl.value.trim();
    if (!newName) {
      alert(MESSAGES.EMPTY_NAME_MSG);
      projectNameInputEl.focus();
      return;
    }
    if (newName) {
      projectService.renameProject(project.id, newName);
      storeProjectsToLocal(projectService.projects);
      useAppState.getState().triggerUpdate();
    }
    exitEditMode();
  };

  const deleteProject = () => {
    const confirmation = confirm(
      'This project and all its tasks will be deleted permanently. Are you sure?'
    );
    if (confirmation) {
      taskService.deleteAllTasksInProject(project.id);
      projectService.deleteProject(project.id);
      storeProjectsToLocal(projectService.projects)
      useAppState.getState().triggerUpdate();
    }
  };

  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    enterEditMode();
  });

  saveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    saveNewName();
  });

  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteProject();
  });

  projectNameInputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveNewName();
    }
  });

  projectNameInputEl.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  projectOptionsEl.appendChild(editBtn);
  projectOptionsEl.appendChild(saveBtn);
  projectOptionsEl.appendChild(deleteBtn);

  return projectOptionsEl;
}