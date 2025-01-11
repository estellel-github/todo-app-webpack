import { createStore } from 'zustand/vanilla'; // Changed from 'zustand'
import { Filter } from '../types/AppTypes';

type AppState = {
  activeProjectId: number;
  currentViewType: 'project' | 'filter';
  currentFilter: Filter;
  isModalOpen: boolean;
  isTaskPaneOpen: boolean;
  activeTaskId: number | null;
  isNewTaskButtonVisible: boolean;
  isAddProjectVisible: boolean;
  editProjectId: number | null;
  needsUpdate: boolean;
  setActiveProjectId: (id: number) => void;
  setViewType: (viewType: 'project' | 'filter') => void;
  setFilter: (filter: Filter) => void;
  toggleModal: (isOpen: boolean) => void;
  toggleTaskPane: (isOpen: boolean, taskId?: number | null) => void;
  setActiveTaskId: (taskId: number | null) => void;
  toggleNewTaskBtn: (isVisible: boolean) => void;
  toggleAddProject: (isVisible: boolean) => void;
  toggleEditProject: (projectId: number | null) => void;
  triggerUpdate: () => void;
  subscribeToStateChange: (callback: () => void) => void;
};

export const useAppState = createStore<AppState>((set) => ({
  activeProjectId: 1,
  currentViewType: 'project',
  currentFilter: '📋 All Tasks',
  isModalOpen: false,
  isTaskPaneOpen: false,
  activeTaskId: null,
  isNewTaskButtonVisible: true,
  isAddProjectVisible: false,
  editProjectId: null,
  needsUpdate: false,
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
  triggerUpdate: () =>
    set((state) => ({
      ...state,
      needsUpdate: !state.needsUpdate,
    })),
  subscribeToStateChange: (callback: () => void) => {
    useAppState.subscribe(callback);
  }
}));