import type { IterDB } from "$src/types";


export async function deleteNote(db: IterDB, id: string): Promise<void> {
  return db.notes.delete(id);
}
