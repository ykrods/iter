import { buildUpdates } from "./base.js";

export class Note {
  constructor({ body }) {
    this.body = body;
  }

  static list(project, n) {
    return project.db.notes.reverse().sortBy('id');
  }

  async save(project) {
    const updates = buildUpdates(this);
    await project.db.notes.put(updates);
    Object.assign(this, updates);
  }
}
