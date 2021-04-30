export class WikiPage {
  constructor({ path, body }) {
    this.path = path;
    this.body = body;
  }

  static get(project, path) {
    return project.db.wiki_pages.get(path);
  }

  async save(project) {
    const updates = this.buildUpdates();
    await project.db.wiki_pages.put(updates);
    Object.assign(this, updates);
  }

  async delete(project) {
    await project.db.wiki_pages.delete(this.path);
  }

  /**
   * Build data object to save
   */
  buildUpdates() {
    const updates = Object.assign({}, this, {
      created_at: this.created_at || new Date(),
      updated_at: new Date(),
    });
    return updates;
  }

  get heading() {
    const n = 30;
    const suffix = (n < this.body.length) ? "..." : "";
    return this.body.replace("\n"," ").substring(0, n) + suffix;
  }
}
