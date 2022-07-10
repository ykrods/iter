import { ulid } from "ulid";

/**
 * Generic model, independent of ID generation method
 */
export class BaseModel {
  constructor(props) {
    this.created_at = props.created_at || new Date();
    this.updated_at = props.updated_at || new Date();
  }

  /**
   *
   */
  static build(props) {
    const ret = new this(props);
    ret.updated_at = new Date();
    return ret;
  }
}

export class UlidModel extends BaseModel {
  constructor(props) {
    super(props);
    this.id = props.id || ulid();
  }
}
