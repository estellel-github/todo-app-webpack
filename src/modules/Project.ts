import { generateId } from "./generateId";
import { ProjectDetails } from "./types";

class Project {
  #id: number;
  #name: string;

  constructor(projectDetails: ProjectDetails) {
    this.#id = projectDetails.id || generateId();
    this.#name = projectDetails.name;
  }

  get id(): number {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  set name(value: string) {
    this.#name = value;
  }

}

export { Project };