import { ProjectList } from './ProjectList';
import { FilterPanel } from './FilterPanel';
import { Project } from '../types/ProjectTypes';

export function Sidebar(
  projects: Project[],
  onProjectSelect: (id: number) => void,
  onFilterChange: (filter: string) => void
): HTMLElement {
  const sidebarDiv = document.createElement('div');
  sidebarDiv.className = 'sidebar';

  const projectList = ProjectList(projects, onProjectSelect);
  const filterPanel = FilterPanel(onFilterChange);

  sidebarDiv.appendChild(filterPanel);
  sidebarDiv.appendChild(projectList);

  return sidebarDiv;
}