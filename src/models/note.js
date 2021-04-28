import { UlidModel } from "./base.js";

export class Note extends UlidModel {
  constructor({ body }) {
    super();
    this.body = body;
  }

  static list(project, n) {
    return project.db.notes.reverse().sortBy("id");
  }

  async save(project) {
    const updates = super.buildUpdates();
    await project.db.notes.put(updates);
    Object.assign(this, updates);
  }

  async delete(project) {
    await project.db.notes.delete(this.id);
  }

  get heading() {
    const n = 30;
    const suffix = (n < this.body.length) ? "..." : "";
    return this.body.replace("\n"," ").substring(0, n) + suffix;
  }
}
