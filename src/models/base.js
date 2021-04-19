import { ulid } from "ulid";

export class BaseModel {
  /**
   * Build data object to save
   */
  buildUpdates() {
    // console.log(JSON.stringify(this));

    const updates = Object.assign({}, this, {
      id: this.id || ulid(),
      created_at: this.created_at || new Date(),
      updated_at: new Date(),
    });
    return updates;
  }
}
