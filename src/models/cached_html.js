import { BaseModel } from "./base.js";

export async function digestMessage(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export class CachedHTML extends BaseModel {
  constructor({ key, rst, html }) {
    super();
    this.key = key;
    this.rst = rst;
    this.html = html;
  }

  static async build({ rst, html }) {
    const key = await digestMessage(rst);
    return new CachedHTML({ key, rst, html });
  }

  static async get(project, rst) {
    const key = await digestMessage(rst);
    return project.db.cached_htmls.get(key);
  }

  async save(project) {
    const updates = this.buildUpdates();
    project.db.cached_htmls.put(this);
    Object.assign(this, updates);
  }

  async delete(project) {
    await project.db.cached_htmls.delete(this.key);
  }
}
