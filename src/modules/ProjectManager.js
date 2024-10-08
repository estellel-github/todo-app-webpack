import { Project } from "./Project";

class ProjectManager {
  constructor() {
    this._projects = [];
  }

  get projects() {
    return this._projects;
  }

  addProject(id, name) {
    const project = new Project(id, name);
    this._projects.push(project);
  }

  findProjectNameFromId(projectId) {
    let project = this._projects.find((project) => project._id === projectId);
    return project.name;
  }

  renameProject(projectId, newName) {
    const project = this._projects.find((project) => project._id === projectId);
    project.name = newName;
  }

  deleteProject(projectId) {
    this._projects = this._projects.filter(
      (project) => project._id !== projectId
    );
  }
}

export { ProjectManager };
