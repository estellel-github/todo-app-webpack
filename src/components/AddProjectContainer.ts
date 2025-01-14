import { createElement } from '../utils/domUtils';
import { useAppState } from '../state/AppState';
import { projectService } from '../services/ProjectService';
import { MESSAGES } from "../utils/constants";
import { storeProjectsToLocal } from "../services/LocalStorage";

export function AddProjectContainer(): HTMLElement {
  const addProjectContainerEl = createElement('div', 'add-project-container', '');
  addProjectContainerEl.id = 'add-project-container';

  let isAddingProject = false;

  const addProjectBtnEl = createElement('button', 'add-project-btn', '+ Add Project');
  addProjectBtnEl.id = 'add-project-btn';

  const projectNameInputEl = createElement('input', 'project-name-input', '') as HTMLInputElement;
  projectNameInputEl.id = 'project-name-input';
  projectNameInputEl.type = 'text';
  projectNameInputEl.placeholder = 'New Project Name';
  projectNameInputEl.style.display = 'none';

  const buttonContainerEl = createElement('div', 'button-container', '');
  buttonContainerEl.id = 'button-container';
  buttonContainerEl.style.display = 'none';

  const createProjectBtnEl = createElement('button', 'create-project-btn', 'Create');
  createProjectBtnEl.id = 'create-project-btn';

  const cancelProjectBtnEl = createElement('button', 'cancel-project-btn', 'Cancel');
  cancelProjectBtnEl.id = 'cancel-project-btn';

  buttonContainerEl.appendChild(createProjectBtnEl);
  buttonContainerEl.appendChild(cancelProjectBtnEl);

  addProjectContainerEl.appendChild(addProjectBtnEl);
  addProjectContainerEl.appendChild(projectNameInputEl);
  addProjectContainerEl.appendChild(buttonContainerEl);

  const enterAddProjectMode = (event: MouseEvent) => {
    event.stopPropagation();
    isAddingProject = true;
    renderAddProjectContainer();
  };

  const exitAddProjectMode = () => {
    isAddingProject = false;
    projectNameInputEl.value = '';
    renderAddProjectContainer();
  };

  const createProject = (event?: MouseEvent | KeyboardEvent) => {
    if (event) event.stopPropagation();
    const newProjectName = projectNameInputEl.value.trim();

    if (!newProjectName) {
      alert(MESSAGES.EMPTY_NAME_MSG);
      projectNameInputEl.focus();
      return;
    }

    projectService.addProject({ id: Date.now(), name: newProjectName });
    storeProjectsToLocal(projectService.projects);

    useAppState.getState().triggerUpdate();

    exitAddProjectMode();
  };
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      createProject(event);
    }
  };

  const renderAddProjectContainer = () => {
    if (isAddingProject) {
      addProjectBtnEl.style.display = 'none';
      projectNameInputEl.style.display = 'block';
      buttonContainerEl.style.display = 'flex';

      projectNameInputEl.focus();
    } else {
      addProjectBtnEl.style.display = 'block';
      projectNameInputEl.style.display = 'none';
      buttonContainerEl.style.display = 'none';
    }
  };

  addProjectBtnEl.addEventListener('click', enterAddProjectMode);
  createProjectBtnEl.addEventListener('click', createProject);
  cancelProjectBtnEl.addEventListener('click', exitAddProjectMode);
  projectNameInputEl.addEventListener('keydown', handleKeydown); // 

  renderAddProjectContainer();

  return addProjectContainerEl;
}
