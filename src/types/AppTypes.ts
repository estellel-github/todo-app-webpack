export interface ProjectDetails {
  id: number | null;
  name: string;
}

export interface TaskDetails {
  id: number | null;
  projectId: number;
  status: Status;
  title: string;
  dueDate: Date;
  priority: Priority;
  notes: string;
}

export const statuses = ["To do", "Done"] as const;
export type Status = typeof statuses[number];

export const priorities = ["Low", "High"] as const;
export type Priority = typeof priorities[number];

export const filters = ['📋 All Tasks', '🔥 Due Today', '🗓️ Due This Week'] as const;
export type Filter = typeof filters[number];

export const viewTypes = ['filter', 'project'] as const;
export type ViewType = typeof viewTypes[number];

export const modalModes = ['task-deletion', 'project-deletion', null] as const;
export type ModalMode = typeof modalModes[number];