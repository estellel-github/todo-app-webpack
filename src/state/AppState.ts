import create from 'zustand';

type AppState = {
  activeProjectId: number;
  currentViewType: 'project' | 'filter';
  currentFilter: string;
  isModalOpen: boolean;
  isTaskPaneOpen: boolean;
  activeTaskId: number | null;
  isNewTaskButtonVisible: boolean;
  isAddProjectVisible: boolean;
  editProjectId: number | null;
  setActiveProjectId: (id: number) => void;
  setViewType: (viewType: 'project' | 'filter') => void;
  setFilter: (filter: string) => void;
  toggleModal: (isOpen: boolean) => void;
  toggleTaskPane: (isOpen: boolean, taskId?: number | null) => void;
  setActiveTaskId: (taskId: number | null) => void;
  toggleNewTaskBtn: (isVisible: boolean) => void;
  toggleAddProject: (isVisible: boolean) => void;
  toggleEditProject: (projectId: number | null) => void;
};

export const useAppState = create.createStore<AppState>((set) => ({
  activeProjectId: 1,
  currentViewType: 'project',
  currentFilter: '',
  isModalOpen: false,
  isTaskPaneOpen: false,
  activeTaskId: null,
  isNewTaskButtonVisible: true,
  isAddProjectVisible: false,
  editProjectId: null,
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setViewType: (viewType) => set({ currentViewType: viewType }),
  setFilter: (filter) => set({ currentFilter: filter }),
  toggleModal: (isOpen) => set({ isModalOpen: isOpen }),
  toggleTaskPane: (isOpen, taskId = null) =>
    set({ isTaskPaneOpen: isOpen, activeTaskId: taskId }),
  setActiveTaskId: (taskId) => set({ activeTaskId: taskId }),
  toggleNewTaskBtn: (isVisible) => set({ isNewTaskButtonVisible: isVisible }),
  toggleAddProject: (isVisible) => set({ isAddProjectVisible: isVisible }),
  toggleEditProject: (projectId) => set({ editProjectId: projectId }),
}));