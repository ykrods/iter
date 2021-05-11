import { UlidModel } from "./base.js";

export class Note extends UlidModel {
  constructor({ body }) {
    super();
    this.body = body;
  }

  static get(project, id) {
    return project.db.notes.get(id);
  }

  static list(project, { limit, offset }) {
    let query = project.db.notes.reverse();
    if ( offset && 0 < offset ) {
      query = query.offset(offset);
    }

    if ( limit && 0 < limit ) {
      query = query.limit(limit);
    }

    return query.sortBy("id");
  }

  static totalCount(project) {
    return project.db.notes.count();
  }

  async save(project) {
    const updates = super.buildUpdates();
    await project.db.notes.put(updates);
    Object.assign(this, updates);
  }

  async delete(project) {
    await project.db.notes.delete(this.id);
  }

  // for search result
  get heading() {
    const n = 30;
    const suffix = (n < this.body.length) ? "..." : "";
    return this.body.replace("\n"," ").substring(0, n) + suffix;
  }

  // for listed items
  get heading_long() {
    const n = 140;
    const suffix = (n < this.body.length) ? "..." : "";
    return this.body.substring(0, n) + suffix;
  }
}
