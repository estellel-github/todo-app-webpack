import { createElement } from '../utils/domUtils';
import { useAppState } from '../state/AppState';
import { taskService } from '../services/TaskService';
import { projectService } from '../services/ProjectService';

export function ProjectContainer(): HTMLElement {
  const projectContainerEl = createElement('div', 'project-container', '');
  projectContainerEl.id = 'project-container';

  const renderProjects = () => {
    projectContainerEl.innerHTML = '';

    const projects = projectService.projects;

    projects.forEach((project) => {
      const projectItemEl = createElement('div', 'project-item', '');

      const projectInfoEl = createElement(
        'div',
        'project-info',
        ''
      );
      projectInfoEl.id = `project-item-${project.id}`;

      const projectNameEl = createElement('div', 'project-name', project.name);

      const numTasksEl = createElement(
        'div',
        'num-tasks',
        taskService.getNumTasksByProject(project.id).toString()
      );
      numTasksEl.id = `num-tasks-${project.id}`;

      projectInfoEl.appendChild(projectNameEl);
      projectInfoEl.appendChild(numTasksEl);

      projectItemEl.appendChild(projectInfoEl);
      projectContainerEl.appendChild(projectItemEl);

      if (project.id !== 1) {
        const projectOptionsEl = createElement(
          'div',
          'project-options',
          ''
        );
        projectOptionsEl.id = `project-options-${project.id}`;

        const editBtn = createElement('button', 'edit-btn', '✏️');
        editBtn.addEventListener('click', () => handleEditProject(project.id));
        projectOptionsEl.appendChild(editBtn);

        const deleteBtn = createElement('button', 'delete-btn', '🗑️');
        deleteBtn.addEventListener('click', () => handleDeleteProject(project.id));
        projectOptionsEl.appendChild(deleteBtn);

        projectItemEl.appendChild(projectOptionsEl);
      }



      projectInfoEl.addEventListener('click', () => {
        useAppState.getState().setActiveProjectId(project.id);
        useAppState.getState().setViewType('project');
      });


    });
  };

  const handleEditProject = (projectId: number) => {
    const projectName = prompt('Edit project name:');
    if (projectName) {
      projectService.renameProject(projectId, projectName);
      useAppState.getState().triggerUpdate();
    }
  };

  const handleDeleteProject = (projectId: number) => {
    const confirmation = confirm(
      'This project and all its tasks will be deleted permanently. Are you sure?'
    );
    if (confirmation) {
      taskService.deleteAllTasksInProject(projectId);
      projectService.deleteProject(projectId);
      useAppState.getState().triggerUpdate();
    }
  };

  useAppState.getState().subscribeToStateChange(() => {
    renderProjects();
  });

  renderProjects();

  return projectContainerEl;
}