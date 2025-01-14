import { createElement } from '../utils/domUtils';
import { FilterContainer } from './FilterContainer';
import { ProjectContainer } from './ProjectContainer';
import { AddProjectContainer } from './AddProjectContainer';

export function Sidebar(): HTMLElement {
  const sidebarEl = createElement('div', 'sidebar', '');
  sidebarEl.id = 'sidebar';

  const filterContainerEl = FilterContainer();
  sidebarEl.appendChild(filterContainerEl);

  const projectContainerEl = ProjectContainer();
  sidebarEl.appendChild(projectContainerEl);

  const addProjectContainerEl = AddProjectContainer();
  sidebarEl.appendChild(addProjectContainerEl);

  return sidebarEl;
}