import type { IterDB } from "$src/types";

import { generateId } from "$src/lib/core/id";


export async function addNote(db: IterDB, content: string): Promise<string> {
  return db.notes.add({
    id: generateId(),
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
