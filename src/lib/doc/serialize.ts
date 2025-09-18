import type { Doc } from "$src/types"


export default function serialize(doc: Doc): string {
  const keys: (keyof Doc)[] = [
    "key",
    "title",
    "createdAt",
    "updatedAt",
  ];
  const metaLines = keys.map((key) => {
    let value: string;
    if (doc[key] instanceof Date) {
      value = doc[key].getTime().toString();
    } else {
      value = doc[key];
    }
    return `  :it-${key}: ${value}`;
  });
  return doc.content + "\n.. meta::\n" + metaLines.join("\n");
}
