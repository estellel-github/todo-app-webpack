import { useAppState } from "../state/AppState";

export function Modal(
  message: string,
  confirmText: string,
  cancelText: string,
  onConfirm: () => void,
  onCancel: () => void
): HTMLElement {
  const modalDiv = document.createElement('div');
  modalDiv.className = 'modal';

  const messageDiv = document.createElement('div');
  messageDiv.className = 'delete-msg';
  messageDiv.textContent = message;

  const confirmButton = document.createElement('button');
  confirmButton.className = 'confirm-btn';
  confirmButton.textContent = confirmText;
  confirmButton.addEventListener('click', () => {
    onConfirm();
    toggleModal(false);
  });


  const cancelButton = document.createElement('button');
  cancelButton.className = 'cancel-btn';
  cancelButton.textContent = cancelText;
  cancelButton.addEventListener('click', () => {
    onCancel();
    toggleModal(false);
  });

  modalDiv.append(messageDiv, confirmButton, cancelButton);
  return modalDiv;
}

export function toggleModal(shouldShow: boolean): void {
  const modal = document.querySelector('.modal') as HTMLElement;
  if (modal) {
    modal.style.display = shouldShow ? 'block' : 'none';
  }
}