import type { RstMeta, Doc } from "$src/types"


async function buildDoc(handle: FileSystemFileHandle, key: string): Promise<Doc> {
  const file = await handle.getFile();

  const txt = await file.text();
  const { content, meta } = parseRst(txt);
  const createdAt = meta.find(m => m.name === "createdAt")?.value;
  const updatedAt = meta.find(m => m.name === "updatedAt")?.value;

  return {
    name: handle.name,
    content,
    key,
    lastModified: new Date(file.lastModified),
    createdAt: new Date(createdAt ? parseInt(createdAt) : file.lastModified),
    updatedAt: new Date(updatedAt ? parseInt(updatedAt) : file.lastModified),
  };
}

async function* walk(handle: FileSystemDirectoryHandle, relpath = ""): AsyncGenerator<Doc> {
  for await (const entry of handle.values()) {
    const key = (relpath === "") ? entry.name : `${relpath}/${entry.name}`;
    if (entry.kind === "directory") {
      yield* walk(entry, key);
    }
    if (entry.kind === "file") {
      if (entry.name.endsWith(".rst")) {
        yield await buildDoc(entry, key);
      }
    }
  }
}

/**
 * parse on js need to exclude meta directive from content
 */
function parseRst(rst: string): { content: string, meta: RstMeta[] } {
  const pos = rst.lastIndexOf(".. meta::");

  if (pos === -1) {
    return { content: rst, meta: [] };
  }

  const content = rst.substring(0, pos)
  const meta_part = rst.substring(pos)

  const meta: RstMeta[] = []
  meta_part.split("\n").forEach((line) => {
    const r = line.match(/^ +:it-(.+): (.+)$/);
    if (r) {
      meta.push({ name: r[1], value: r[2] });
    }
  });

  return { content, meta };
}

export async function buildDocumentDB(handle: FileSystemDirectoryHandle) {
  const docs = [];
  const decisions = [];
  const journals = [];

  for await (const doc of walk(handle)) {
    if (doc.key.startsWith("docs/")) {
      docs.push(doc);
    } else if (doc.key.startsWith("decisions/")) {
      decisions.push(doc);
    } else if (doc.key.startsWith("journals/")) {
      journals.push(doc);
    }
  }
  const byKey = (a: Doc, b: Doc) => (a.key < b.key) ? -1 : 1;
  return {
    docs: docs.sort(byKey),
    decisions: decisions.sort(byKey),
    journals: journals.sort(byKey),
  };
}
