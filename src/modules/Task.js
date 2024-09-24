import { generateTaskId } from "./generateTaskId";

class Task {
  constructor(
    projectId,
    status,
    title,
    desc,
    dueDate,
    priority,
    notes,
    checklist,
  ) {
    this._id = generateTaskId();
    this._projectId = projectId;
    this._status = status;
    this._title = title;
    this._desc = desc;
    this._dueDate = dueDate;
    this._priority = priority;
    this._notes = notes;
    this._checklist = checklist;
  }

  get id() {
    return this._id;
  }

  get projectId() {
    return this._projectId;
  }

  set project(projectId) {
    this._project = projectId;
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

  get desc() {
    return this._desc;
  }

  set desc(value) {
    this._desc = value;
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

  get checklist() {
    return this._checklist;
  }

  set checklist(value) {
    this._checklist = value;
  }
}

export { Task };
