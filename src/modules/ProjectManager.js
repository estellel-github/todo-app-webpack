"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManager = void 0;
const Project_1 = require("./Project");
class ProjectManager {
    constructor() {
        this._projects = [];
    }
    get projects() {
        return this._projects;
    }
    addProject(projectDetails) {
        const project = new Project_1.Project(projectDetails);
        this._projects.push(project);
    }
    findProjectNameFromId(projectId) {
        var _a;
        return (_a = this._projects.find((project) => project.id === projectId)) === null || _a === void 0 ? void 0 : _a.name;
    }
    renameProject(projectId, newName) {
        const project = this._projects.find((project) => project.id === projectId);
        if (project)
            project.name = newName;
    }
    deleteProject(projectId) {
        this._projects = this._projects.filter((project) => project.id !== projectId);
    }
}
exports.ProjectManager = ProjectManager;
