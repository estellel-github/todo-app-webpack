"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const generateId_1 = require("./generateId");
class Project {
    constructor(projectDetails) {
        this._id = projectDetails.id || (0, generateId_1.generateId)();
        this._name = projectDetails.name;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this.name = value;
    }
}
exports.Project = Project;
