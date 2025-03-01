import type { IterDB } from "$src/types";


export async function addDoc(db: IterDB, key: string, content: string): Promise<string> {
  return db.docs.add({
    key: generateId(),
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
