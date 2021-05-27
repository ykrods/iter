import { sanitize } from "../file.js";
import { BaseModel } from "./base.js";

export class WikiPage extends BaseModel {
  constructor({ path, body }) {
    super();
    this.path = path;
    this.body = body;
  }

  static get(project, path) {
    return project.db.wiki_pages.get(path);
  }

  async save(project) {
    const updates = this.buildUpdates();
    if (updates.path.charAt(updates.path.length - 1) === "/") {
      updates.path = updates.path + "index";
    }
    updates.path = updates.path.split("/")
      .map(p => sanitize(p))
      .filter(o => o) // ignore empty
      .join("/");

    if( !updates.path ) {
      throw new Error("Invalid path");
    }

    await project.db.wiki_pages.put(updates);
    Object.assign(this, updates);
  }

  async delete(project) {
    await project.db.wiki_pages.delete(this.path);
  }

  get heading() {
    const n = 30;
    const suffix = (n < this.body.length) ? "..." : "";
    return this.body.replace("\n"," ").substring(0, n) + suffix;
  }
}
