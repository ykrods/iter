import { UlidModel } from "./base.js";

export class Journal extends UlidModel {
  constructor(props) {
    super(props);
    this.body = props.body;
  }

  // for search result
  get heading() {
    const n = 30;
    const suffix = (n < this.body.length) ? "..." : "";
    return this.body.replace("\n"," ").substring(0, n) + suffix;
  }

  // for listed items
  get heading_long() {
    const n = 140;
    const suffix = (n < this.body.length) ? "..." : "";
    return this.body.substring(0, n) + suffix;
  }
}
