import { Project } from "./Project";
import { ProjectDetails } from "./types";

class ProjectManager {
  private _projects: Project[];

  constructor() {
    this._projects = [];
  }

  get projects(): Project[] {
    return this._projects;
  }

  addProject(projectDetails: ProjectDetails): void {
    const project = new Project(projectDetails);
    this._projects.push(project);
  }

  findProjectNameFromId(projectId: number): string | undefined {
    return this._projects.find((project) => project.id === projectId)?.name;
  }

  renameProject(projectId: number, newName: string): void {
    const project = this._projects.find((project) => project.id === projectId);
    if (project) project.name = newName;
  }

  deleteProject(projectId: number): void {
    this._projects = this._projects.filter(
      (project) => project.id !== projectId
    );
  }
}

export { ProjectManager };
