import { generateId } from "./generateId";

class Project {
  constructor(id, name) {
    this._id = id || generateId();
    this._name = name;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

}

export { Project };