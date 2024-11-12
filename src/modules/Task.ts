import { generateId } from "./generateId";
import { TaskDetails, Status, Priority } from "./types";

class Task {
  #id: number;
  #projectId: number;
  #status: Status;
  #title: string;
  #dueDate: Date;
  #priority: Priority;
  #notes: string;

  constructor(taskDetails: TaskDetails) {
    this.#id = taskDetails.id || generateId();
    this.#projectId = taskDetails.projectId;
    this.#status = taskDetails.status;
    this.#title = taskDetails.title;
    this.#dueDate = taskDetails.dueDate;
    this.#priority = taskDetails.priority;
    this.#notes = taskDetails.notes;
  }

  get id(): number {
    return this.#id;
  }

  get projectId(): number {
    return this.#projectId;
  }

  set projectId(projectId: number) {
    this.#projectId = projectId;
  }

  get status(): Status {
    return this.#status;
  }

  set status(value: Status) {
    this.#status = value;
  }

  get title(): string {
    return this.#title;
  }

  set title(value: string) {
    this.#title = value;
  }

  get dueDate(): Date {
    return this.#dueDate;
  }

  set dueDate(value: Date) {
    this.#dueDate = value;
  }

  get priority(): Priority {
    return this.#priority;
  }

  set priority(value: Priority) {
    this.#priority = value;
  }

  get notes(): string {
    return this.#notes;
  }

  set notes(value: string) {
    this.#notes = value;
  }

}

export { Task };
