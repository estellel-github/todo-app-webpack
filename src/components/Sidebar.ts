import { createElement } from '../utils/domUtils';
import { FilterContainer } from './FilterContainer';
import { ProjectContainer } from './ProjectContainer';

export function Sidebar(): HTMLElement {
  // Sidebar main container
  const sidebarEl = createElement('div', 'sidebar', '');
  sidebarEl.id = 'sidebar';

  // Filter container
  const filterContainerEl = FilterContainer();
  sidebarEl.appendChild(filterContainerEl);

  // Project container
  const projectContainerEl = ProjectContainer();
  sidebarEl.appendChild(projectContainerEl);

  // Add Project container
  // const addProjectContainerEl = AddProjectContainer();
  // sidebarEl.appendChild(addProjectContainerEl);

  return sidebarEl;
}