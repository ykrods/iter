export class Project {
  static async list() {
    const ids = ['foo', 'bar'];
    return ids.map((id) => new Project(id));
  }

  static exists(id) {
    return true;
  }

  constructor(id) {
    this.id = id;
  }

  url(rel = "") {
    return `/${this.id}${rel}`;
  }
}
