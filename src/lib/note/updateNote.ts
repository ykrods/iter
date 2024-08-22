import type { IterDB } from "$src/types";


export async function updateNote(
  db: IterDB,
  id: string,
  content: string,
): Promise<number> {
  return db.notes.update(id, { content, updatedAt: new Date() });
}
