import { Project } from '../types/ProjectTypes';

export function ProjectList(
  projects: Project[],
  onProjectSelect: (id: number) => void
): HTMLElement {
  const projectListDiv = document.createElement('div');
  projectListDiv.className = 'project-list';

  projects.forEach((project) => {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project-item';
    projectDiv.textContent = project.name;
    projectDiv.addEventListener('click', () => onProjectSelect(project.id));
    projectListDiv.appendChild(projectDiv);
  });

  return projectListDiv;
}