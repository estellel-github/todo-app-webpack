"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ProjectManager_projects;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManager = void 0;
const Project_1 = require("./Project");
class ProjectManager {
    constructor() {
        _ProjectManager_projects.set(this, void 0);
        __classPrivateFieldSet(this, _ProjectManager_projects, [], "f");
    }
    get projects() {
        return __classPrivateFieldGet(this, _ProjectManager_projects, "f");
    }
    addProject(projectDetails) {
        const project = new Project_1.Project(projectDetails);
        __classPrivateFieldGet(this, _ProjectManager_projects, "f").push(project);
    }
    findProjectNameFromId(projectId) {
        const project = __classPrivateFieldGet(this, _ProjectManager_projects, "f").find((project) => project.id === projectId);
        return project ? project.name : undefined;
    }
    renameProject(projectId, newName) {
        const project = __classPrivateFieldGet(this, _ProjectManager_projects, "f").find((project) => project.id === projectId);
        if (project)
            project.name = newName;
    }
    deleteProject(projectId) {
        __classPrivateFieldSet(this, _ProjectManager_projects, __classPrivateFieldGet(this, _ProjectManager_projects, "f").filter((project) => project.id !== projectId), "f");
    }
}
exports.ProjectManager = ProjectManager;
_ProjectManager_projects = new WeakMap();
