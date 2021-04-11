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

  get url() {
    return `/${this.id}`;
  }

  async save() {
    this._db = getDB(this.id);
    await this._db.open();
  }
}
