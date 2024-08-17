import type { IterDB } from "$src/types"

export function getNote(db: IterDB, id: string) {
  return db.notes.get(id);
}
