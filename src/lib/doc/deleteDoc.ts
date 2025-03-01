import type { IterDB } from "$src/types";


export async function deleteDoc(db: IterDB, key: string): Promise<void> {
  return db.docs.delete(key);
}
