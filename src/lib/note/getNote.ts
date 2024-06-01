import type { IterDB, Note } from "$src/types";


// db.notes.get returns `PromiseExtended`, so use async function to convert to Promise
export async function getNote(db: IterDB, id: string): Promise<Note | undefined> {
  return await db.notes.get(id);
}
