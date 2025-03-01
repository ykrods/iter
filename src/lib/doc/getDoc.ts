import type { IterDB, Doc } from "$src/types";


// db.notes.get returns `PromiseExtended`, so use async function to convert to Promise
export async function getDoc(db: IterDB, key: string): Promise<Doc | undefined> {
  return await db.docs.get(key);
}
