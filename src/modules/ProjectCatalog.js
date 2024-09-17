import { Project } from "./modules/Project";

class ProjectCatalog {
  constructor() {
    this._projects = [];
  }

  get projects() {
    return this._projects;
  }

  addProject(name) {
    let id = this._projects.length + 1;
    const project = new Project(id, name);
    this._projects.push(project);
    return project;
  }

  findProjectById(id) {
    return this._projects.find((project) => project.id === id);
  }

  renameProject(id, newName) {
    const project = this.findProjectById(id);
    if (project) {
      project.name = newName;
    }
  }

  deleteProject(projectId) {
    const project = this.findProjectById(id);
    if (project) {
      this._projects = this._projects.filter(
        (project) => project.id !== projectId
      );
    }
  }
}

export { ProjectCatalog };