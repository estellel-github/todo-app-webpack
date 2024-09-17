class Project {
  constructor(id, name) {
    this._id = id;
    this._name = name;
    this._tasks = [];
  }

  get id() {
    return this._id;
  }

  set id(projectId) {
    this._id = projectId;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get tasks() {
    return this._tasks;
  }

  set tasks(tasks) {
    this._tasks = tasks;
  }
}

export { Project };

// const project1 = new Project("Test Project Title");

// const task1 = new Task("1", "Work Project", "Active", "Test title", "Test desc", "2023-09-15", "High", "Meeting notes", ["Item 1", "Item 2"]);

// project1.addTask(task1);

// console.table(project1);