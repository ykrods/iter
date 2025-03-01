import type { IterDB } from "$src/types";


export async function updateDoc(
  db: IterDB,
  key: string,
  content: string,
): Promise<number> {
  return db.docs.update(key, { content, updatedAt: new Date() });
}
