import { createStore } from 'zustand/vanilla'; // Changed from 'zustand'
import { Filter, ViewType, ModalMode } from '../types/AppTypes';

type AppState = {
  activeProjectId: number;
  currentViewType: ViewType;
  currentFilter: Filter;
  isModalOpen: boolean;
  modalMode: ModalMode;
  isTaskPaneOpen: boolean;
  activeTaskId: number | null;
  isNewTaskButtonVisible: boolean;
  isAddProjectVisible: boolean;
  editProjectId: number | null;
  needsUpdate: boolean;
  setActiveProjectId: (id: number) => void;
  setViewType: (viewType: ViewType) => void;
  setFilter: (filter: Filter) => void;
  toggleModal: (isOpen: boolean, mode: ModalMode) => void;
  toggleTaskPane: (isOpen: boolean, taskId: number | null) => void;
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
  modalMode: null,
  isTaskPaneOpen: false,
  activeTaskId: null,
  isNewTaskButtonVisible: true,
  isAddProjectVisible: false,
  editProjectId: null,
  needsUpdate: false,
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setViewType: (viewType) => set({ currentViewType: viewType }),
  setFilter: (filter) => set({ currentFilter: filter }),
  toggleModal: (isOpen, mode = null) =>
    set({ isModalOpen: isOpen, modalMode: mode }),
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
  },
}));