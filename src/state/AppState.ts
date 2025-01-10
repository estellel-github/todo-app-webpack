import create from 'zustand';

type AppState = {
  activeProjectId: number;
  currentViewType: 'project' | 'filter';
  currentFilter: string;
  isModalOpen: boolean;
  isTaskPaneOpen: boolean;
  activeTaskId: number | null; // New state for the active task
  setActiveProjectId: (id: number) => void;
  setViewType: (viewType: 'project' | 'filter') => void;
  setFilter: (filter: string) => void;
  toggleModal: (isOpen: boolean) => void;
  toggleTaskPane: (isOpen: boolean, taskId?: number | null) => void;
  setActiveTaskId: (taskId: number | null) => void; // Setter for activeTaskId
};

export const useAppState = create.createStore<AppState>((set) => ({
  activeProjectId: 1,
  currentViewType: 'project',
  currentFilter: '',
  isModalOpen: false,
  isTaskPaneOpen: false,
  activeTaskId: null, // Initialize with no active task
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setViewType: (viewType) => set({ currentViewType: viewType }),
  setFilter: (filter) => set({ currentFilter: filter }),
  toggleModal: (isOpen) => set({ isModalOpen: isOpen }),
  toggleTaskPane: (isOpen, taskId = null) =>
    set({ isTaskPaneOpen: isOpen, activeTaskId: taskId }),
  setActiveTaskId: (taskId) => set({ activeTaskId: taskId }),
}));
