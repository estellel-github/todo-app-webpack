import { createElement } from '../utils/domUtils';
import { useAppState } from '../state/AppState';
import { taskService } from '../services/TaskService';
import { projectService } from '../services/ProjectService';
import { storeProjectsToLocal, storeTasksToLocal } from '../services/LocalStorage';
import { MESSAGES, BUTTONS_TXT } from '../utils/constants';

export function Modal(): HTMLElement {
  const modalEl = createElement('div', 'modal', '');
  modalEl.id = 'modal';
  modalEl.style.display = 'none';

  const modalMsgEl = createElement('div', 'modal-msg', '');
  modalMsgEl.id = 'modal-msg';

  const confirmBtnEl = createElement('button', 'delete-btn', BUTTONS_TXT.DELETE);
  confirmBtnEl.id = 'confirm-btn';

  const cancelBtnEl = createElement('button', 'cancel-btn', BUTTONS_TXT.CANCEL);
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

    if (modalMode === 'task-deletion' && activeTaskId) {
      taskService.deleteTask(activeTaskId);
      storeTasksToLocal(taskService.getAllTasks());
    } else if (modalMode === 'project-deletion' && activeProjectId && activeProjectId !== 1) {
      taskService.deleteAllTasksInProject(activeProjectId);
      projectService.deleteProject(activeProjectId);
      useAppState.getState().setActiveProjectId(1);
      storeProjectsToLocal(projectService.projects);
    }

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