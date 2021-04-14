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
      query = query.where('status').anyOf(filter.statuses)
    }
    return query.reverse().sortBy('_', (ary) => {
      return ary.sort((a, b) => {
        const i = new Date(1970, 1, 1);
        return  ((a.updated_at || i) < (b.updated_at || i));
      });
    });
  }

  async save(project) {
    const updates = super.buildUpdates();
    await project.db.issues.put(updates);
    Object.assign(this, updates);
  }

  get shorten_id() {
    return this.id.substring(10, 15);
  }
  get status_disp() {
    return ISSUE_STATUSES[this.status];
  }
}
