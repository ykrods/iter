import Dexie from "dexie";

import { getDatabaseIds, getDBName, getDB } from "../db.js";

export class Project {
  static async list() {
    const ids = await getDatabaseIds();
    return ids.map((id) => new Project(id));
  }

  static exists(id) {
    return Dexie.exists(getDBName(id));
  }

  constructor(id) {
    this.id = id;
  }

  get db() {
    if (this._db === undefined) {
      this._db = getDB(this.id);
    }
    return this._db;
  }

  url(rel = "") {
    return `/${this.id}${rel}`;
  }

  async save() {
    await this.db.open();
  }

  import(blob) {
    return this.db.import(blob, { acceptNameDiff: true });
  }
  export() {
    return this.db.export();
  }
  async delete() {
    await this.db.delete();
  }
}
