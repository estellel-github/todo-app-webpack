import { generateId } from "./generateId";
import { ProjectDetails } from "./types";

class Project {
  private _id: number;
  private _name: string;

  constructor(projectDetails: ProjectDetails) {
    this._id = projectDetails.id || generateId();
    this._name = projectDetails.name;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

}

export { Project };