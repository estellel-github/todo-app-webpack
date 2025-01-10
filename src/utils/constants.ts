export const INBOX_ID = 1;

export const TASK_STATUSES = ['To do', 'Done'] as const;

export const TASK_PRIORITIES = ['Low', 'High'] as const;

export const MESSAGES = {
  DELETE_TASK_CONFIRM: 'Are you sure you want to delete this task?',
  DELETE_PROJECT_CONFIRM: 'This project and all its tasks will be deleted permanently.',
  EMPTY_PROJECT_MSG: 'This project has no tasks. Add a new one!',
};

export const MODAL_BUTTONS = {
  CONFIRM: 'Confirm',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
};