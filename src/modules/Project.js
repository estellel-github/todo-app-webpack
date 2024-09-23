class Project {
  constructor(id, name) {
    this._id = id;
    this._name = name;
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

}

export { Project };