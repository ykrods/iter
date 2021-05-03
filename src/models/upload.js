import { BaseModel } from "./base.js";

// Avoid naming "File", but it is practically File.
export class Upload extends BaseModel {
  constructor(blob) {
    super();
    this.name = blob.name;
    this.blob = blob;
  }

  async save(project) {
    const updates = this.buildUpdates();
    await project.db.uploads.put(updates);
    Object.assign(this, updates);
  }

  static list(project) {
    return project.db.uploads.toArray();
  }
}
