import create from 'zustand';

type AppState = {
  activeProjectId: number;
  currentViewType: 'project' | 'filter';
  currentFilter: string;
  setActiveProjectId: (id: number) => void;
  setViewType: (viewType: 'project' | 'filter') => void;
  setFilter: (filter: string) => void;
};

export const useAppState = create.createStore<AppState>((set) => ({
  activeProjectId: 1,
  currentViewType: 'project',
  currentFilter: '',
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setViewType: (viewType) => set({ currentViewType: viewType }),
  setFilter: (filter) => set({ currentFilter: filter }),
}));