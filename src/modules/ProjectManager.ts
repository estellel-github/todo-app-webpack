import { Project } from "./Project";
import { ProjectDetails } from "./types";

class ProjectManager {
  #projects: Project[];

  constructor() {
    this.#projects = [];
  }

  get projects(): Project[] {
    return this.#projects;
  }

  addProject(projectDetails: ProjectDetails): void {
    const project = new Project(projectDetails);
    this.#projects.push(project);
  }

  findProjectNameFromId(projectId: number): string | undefined {
    return this.#projects.find((project) => project.id === projectId)?.name;
  }

  renameProject(projectId: number, newName: string): void {
    const project = this.#projects.find((project) => project.id === projectId);
    if (project) project.name = newName;
  }

  deleteProject(projectId: number): void {
    this.#projects = this.#projects.filter(
      (project) => project.id !== projectId
    );
  }
}

export { ProjectManager };
