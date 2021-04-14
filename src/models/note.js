import { BaseModel } from "./base.js";

export class Note extends BaseModel {
  constructor({ body }) {
    super();
    this.body = body;
  }

  static list(project, n) {
    return project.db.notes.reverse().sortBy('id');
  }

  async save(project) {
    const updates = super.buildUpdates();
    await project.db.notes.put(updates);
    Object.assign(this, updates);
  }
}
