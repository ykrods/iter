import { ulid } from "ulid";

/**
 * Generic model, independent of ID generation method
 */
export class BaseModel {
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
}

export class UlidModel extends BaseModel {
  /**
   * Build data object to save
   */
  buildUpdates() {
    const updates = super.buildUpdates();
    updates.id = this.id || ulid();
    return updates;
  }
}
