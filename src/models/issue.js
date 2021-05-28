import { BaseModel } from "./base.js";

export const ISSUE_STATUSES = {
  OPEN: "Open",
  PENDING: "Pending",
  DECLINED: "Declined",
  CLOSED: "Closed",
};

export class Issue extends BaseModel {
  constructor({ title, body, status }) {
    super();
    this.title = title;
    this.body = body;
    this.status = status;
  }

  static list(project, filter = {}, n = undefined) {
    let query = project.db.issues;
    if (filter.statuses) {
      query = query.where("status").anyOf(filter.statuses);
    }
    return query.reverse().sortBy("_", (ary) => {
      return ary.sort((a, b) => {
        const i = new Date(1970, 1, 1);
        return (a.updated_at || i) < (b.updated_at || i);
      });
    });
  }

  static get(project, id) {
    return project.db.issues.get(parseInt(id, 10));
  }

  async save(project) {
    const updates = super.buildUpdates();
    if (!updates.id) {
      // XXX: id is reused when last record has deleted
      const last = await project.db.issues.orderBy('id').last();
      updates.id = last && last.id + 1 || 1;
    }

    await project.db.issues.put(updates);
    Object.assign(this, updates);
  }

  async delete(project) {
    await project.db.issues.delete(this.id);
  }

  get status_disp() {
    return ISSUE_STATUSES[this.status];
  }
  toRst() {
    const titleLine = "=".repeat((new Blob([this.title])).size);
    return `:status: ${this.status}
:created_at: ${this.created_at.toISOString()}
:updated_at: ${this.updated_at.toISOString()}

${titleLine}
${this.title}
${titleLine}

${this.body}`;
  }
}
