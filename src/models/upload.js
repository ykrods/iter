import { sanitize } from "../file.js";
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
    updates.name = sanitize(updates.name);

    if( !updates.name ) {
      throw new Error("Invalid filename");
    }

    await project.db.uploads.put(updates);
    Object.assign(this, updates);
  }

  delete(project) {
    return project.db.uploads.delete(this.name);
  }

  static list(project) {
    return project.db.uploads.toArray();
  }
}
