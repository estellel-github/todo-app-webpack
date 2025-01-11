import { createElement } from '../utils/domUtils';
import { useAppState } from '../state/AppState';
import { taskService } from '../services/TaskService';
import { projectService } from '../services/ProjectService';
import { ProjectOptions } from './ProjectOptions';

export function ProjectContainer(): HTMLElement {
  const projectContainerEl = createElement('div', 'project-container', '');
  projectContainerEl.id = 'project-container';

  const renderProjects = () => {
    projectContainerEl.innerHTML = '';

    const projects = projectService.projects;

    projects.forEach((project) => {
      const projectItemEl = createElement('div', 'project-item', '');
      const projectInfoEl = createElement('div', 'project-info', '');
      const projectNameEl = createElement('div', 'project-name', project.name);

      projectInfoEl.id = `project-info-${project.id}`;
      projectItemEl.id = `project-item-${project.id}`;
      projectNameEl.id = `project-name-${project.id}`;

      const numTasksEl = createElement(
        'div',
        'num-tasks',
        taskService.getNumTasksByProject(project.id).toString()
      );
      numTasksEl.id = `num-tasks-${project.id}`;

      projectInfoEl.appendChild(projectNameEl);
      projectInfoEl.appendChild(numTasksEl);

      projectItemEl.appendChild(projectInfoEl);

      if (project.id !== 1) {
        const projectOptionsEl = ProjectOptions(project);
        console.log(projectOptionsEl);
        projectItemEl.appendChild(projectOptionsEl);
      }

      projectItemEl.addEventListener('click', () => {
        useAppState.getState().setActiveProjectId(project.id);
        useAppState.getState().setViewType('project');
      });

      projectContainerEl.appendChild(projectItemEl);
    });
  };

  useAppState.getState().subscribeToStateChange(() => {
    renderProjects();
  });

  renderProjects();

  return projectContainerEl;
}