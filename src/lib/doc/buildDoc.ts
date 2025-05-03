import type { Doc } from "$src/types"
import parseRst from "./parseRst"

async function buildDoc(
  handle: FileSystemFileHandle,
  key: string
): Promise<Doc> {
  const file = await handle.getFile();

  const txt = await file.text();
  const { content, meta } = parseRst(txt);
  const createdAt = meta.find(m => m.name === "createdAt")?.value;
  const updatedAt = meta.find(m => m.name === "updatedAt")?.value;

  return {
    id: key,
    name: handle.name,
    content,
    key,
    lastModified: new Date(file.lastModified),
    createdAt: new Date(createdAt ? parseInt(createdAt) : file.lastModified),
    updatedAt: new Date(updatedAt ? parseInt(updatedAt) : file.lastModified),
  };
}
export default buildDoc;
