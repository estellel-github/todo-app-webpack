class Task {
  constructor(id, project, status, title, desc, dueDate, priority, notes, checklist) {
    this._id = id;
    this._project = project;
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

  get project() {
    return this._project;
  }
  
  set project(value) {
    this._project = value;
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

// const testTask = new Task("Work Project", "Active", "Test title", "Test desc", "2023-09-15", "High", "Meeting notes", ["Item 1", "Item 2"]);

// console.log(testTask);

// console.log(testTask.title = "Edited test title");

// console.log(testTask);