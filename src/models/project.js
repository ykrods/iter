import { recursiveFileHandle } from "$src/lib/fs.js";

export default class Project {
  constructor({ id, handle }) {
    /** @type {string} */
    this.id = id;
    /** @type {FileSystemDirectoryHandle} */
    this.handle = handle;
  }

  getContent(key) {
    return recursiveFileHandle(this.handle, key);
  }

  previewUrl(rel = "") {
    return `/p/${encodeURIComponent(this.id)}/${rel}`;
  }

  appUrl(rel = "") {
    return `/a/${encodeURIComponent(this.id)}/${rel}`;
  }
}
