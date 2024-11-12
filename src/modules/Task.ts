import { generateId } from "./generateId";
import { TaskDetails, Status, Priority } from "./types";

class Task {
  private _id: number;
  private _projectId: number;
  private _status: Status;
  private _title: string;
  private _dueDate: Date;
  private _priority: Priority;
  private _notes: string;

  constructor(taskDetails: TaskDetails) {
    this._id = taskDetails.id || generateId();
    this._projectId = taskDetails.projectId;
    this._status = taskDetails.status;
    this._title = taskDetails.title;
    this._dueDate = taskDetails.dueDate;
    this._priority = taskDetails.priority;
    this._notes = taskDetails.notes;
  }

  get id(): number {
    return this._id;
  }

  get projectId(): number {
    return this._projectId;
  }

  set projectId(projectId: number) {
    this._projectId = projectId;
  }

  get status(): Status {
    return this._status;
  }

  set status(value: Status) {
    this._status = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get dueDate(): Date {
    return this._dueDate;
  }

  set dueDate(value: Date) {
    this._dueDate = value;
  }

  get priority(): Priority {
    return this._priority;
  }

  set priority(value: Priority) {
    this._priority = value;
  }

  get notes(): string {
    return this._notes;
  }

  set notes(value: string) {
    this._notes = value;
  }

}

export { Task };
