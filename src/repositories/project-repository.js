import { getDB } from "$src/db.js";
import * as idb from "$src/lib/indexed-db.js";
import Project from "$src/models/project.js";

class NotFoundError extends Error {}

export default class ProjectRepository {
  static async build() {
    const db = await getDB();
    return new ProjectRepository(db);
  }
  constructor(db) {
    this.db = db;
  }
  async list() {
    const result = await idb.getAll(this.db, "projects");
    return result.map(o => new Project(o));
  }
  async get(id) {
    const result = await idb.get(this.db, "projects", id);
    if (!result) throw new NotFoundError();
    return new Project(result);
  }
  async put(project) {
    await idb.put(this.db, "projects", project);
    return new Project(await idb.get(this.db, "projects", project.id));
  }
  async clear() {
    const result = await idb.clear(this.db, "projects");
  }
}
