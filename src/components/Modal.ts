import { createElement } from '../utils/domUtils';
import { useAppState } from '../state/AppState';
import { taskService } from '../services/TaskService';
import { projectService } from '../services/ProjectService';
import { storeProjectsToLocal, storeTasksToLocal } from '../services/LocalStorage';
import { MESSAGES } from '../utils/constants';

export function Modal(): HTMLElement {
  const modalEl = createElement('div', 'modal', '');
  modalEl.id = 'modal';
  modalEl.style.display = 'none';

  const modalMsgEl = createElement('div', 'modal-msg', '');
  modalMsgEl.id = 'modal-msg';

  const confirmBtnEl = createElement('button', 'confirm-btn', 'Confirm');
  confirmBtnEl.id = 'confirm-btn';

  const cancelBtnEl = createElement('button', 'cancel-btn', 'Cancel');
  cancelBtnEl.id = 'cancel-btn';

  modalEl.appendChild(modalMsgEl);
  modalEl.appendChild(confirmBtnEl);
  modalEl.appendChild(cancelBtnEl);



  const hideModal = () => {
    const { isModalOpen, modalMode } = useAppState.getState();
    if (isModalOpen || modalMode !== null) {
      modalEl.style.display = 'none';
      useAppState.getState().toggleModal(false, null);
    }
  };

  const handleConfirm = () => {
    const { modalMode, activeTaskId, activeProjectId } = useAppState.getState();
    console.log('Modal Confirm Clicked:', { modalMode, activeTaskId, activeProjectId });

    if (modalMode === 'task-deletion' && activeTaskId) {
      taskService.deleteTask(activeTaskId);
      console.log('Deleting task with ID:', activeTaskId);
      storeTasksToLocal(taskService.getAllTasks());
    } else if (modalMode === 'project-deletion' && activeProjectId && activeProjectId !== 1) {
      taskService.deleteAllTasksInProject(activeProjectId);
      projectService.deleteProject(activeProjectId);
      console.log('Deleting project with ID:', activeProjectId);
      storeProjectsToLocal(projectService.projects)
    }
    console.log("Triggering state update: modal confirmation");
    useAppState.getState().triggerUpdate();
    hideModal();
  };

  const handleCancel = () => {
    hideModal();
  };

  confirmBtnEl.addEventListener('click', handleConfirm);
  cancelBtnEl.addEventListener('click', handleCancel);

  useAppState.getState().subscribeToStateChange(() => {
    const { isModalOpen, modalMode } = useAppState.getState();

    console.log("Subscription triggering rerender: filters");

    if (isModalOpen) {
      if (modalMode === 'task-deletion') {
        modalMsgEl.textContent = MESSAGES.DELETE_TASK_CONFIRM;
      } else if (modalMode === 'project-deletion') {
        modalMsgEl.textContent = MESSAGES.DELETE_PROJECT_CONFIRM;
      }
      modalEl.style.display = 'block';
    } else {
      hideModal();
    }
  });

  return modalEl;
}
