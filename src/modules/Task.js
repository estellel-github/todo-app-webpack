import { generateId } from "./generateId";

class Task {
  constructor(
    projectId,
    status,
    title,
    dueDate,
    priority,
    notes,
  ) {
    this._id = generateId();
    this._projectId = projectId;
    this._status = status;
    this._title = title;
    this._dueDate = dueDate;
    this._priority = priority;
    this._notes = notes;
  }

  get id() {
    return this._id;
  }

  get projectId() {
    return this._projectId;
  }

  set projectId(projectId) {
    this._projectId = projectId;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get dueDate() {
    return this._dueDate;
  }

  set dueDate(value) {
    this._dueDate = value;
  }

  get priority() {
    return this._priority;
  }

  set priority(value) {
    this._priority = value;
  }

  get notes() {
    return this._notes;
  }

  set notes(value) {
    this._notes = value;
  }

}

export { Task };
