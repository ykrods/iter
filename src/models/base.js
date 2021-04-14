import { ulid } from 'ulid';

export function buildUpdates(model) {
  const updates = Object.assign({}, model);
  updates.id = updates.id || ulid();
  updates.created_at = updates.created_at || new Date();
  updates.updated_at = new Date();

  return updates;
}
