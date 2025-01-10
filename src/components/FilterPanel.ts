export function FilterPanel(
  onFilterChange: (filter: string) => void
): HTMLElement {
  const filterPanelDiv = document.createElement('div');
  filterPanelDiv.className = 'filter-panel';

  const filters = ['📋 All Tasks', '🔥 Due Today', '🗓️ Due This Week'];

  filters.forEach((filter) => {
    const filterButton = document.createElement('button');
    filterButton.textContent = filter;
    filterButton.addEventListener('click', () => onFilterChange(filter));
    filterPanelDiv.appendChild(filterButton);
  });

  return filterPanelDiv;
}