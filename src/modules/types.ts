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

