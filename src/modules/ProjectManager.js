import { Project } from "./Project";

class ProjectManager {
  constructor() {
    this._projects = [];
  }

  get projects() {
    return this._projects;
  }

  createInbox() {
    const inbox = new Project(0, "Inbox");
    this._projects.push(inbox);
  }

  addProject(name) {
    let projectId = this._projects.length;
    const project = new Project(projectId, name);
    this._projects.push(project);
  }

  findProjectById(projectId) {
    return this._projects.find((project) => project._id === projectId);
  }

  renameProject(projectId, newName) {
    const project = this.findProjectById(projectId);
    project.name = newName;
  }

  deleteProject(projectId) {
    this._projects = this._projects.filter(
      (project) => project._id !== projectId
    );
  }
}

export { ProjectManager };
