import type { AsyncWorkerClient, Workspace, Shelf, Doc, Documents as DocumentsType } from "$src/types";

import generateId from "$src/lib/generateId";


function createDocBuilder(
  Documents: DocumentsType,
  client: AsyncWorkerClient
) {
  const generateKey: (shelf: Shelf, inputName: string) => string = (shelf, inputName) => {
    if (shelf.type === "note") {
      return `${shelf.name}/${generateId()}.rst`;
    }
    if (shelf.type === "folder") {
      return `${shelf.name}/${inputName}.rst`;
    }
    if (shelf.type === "serial") {
      const last = Documents.findOne({ key: new RegExp(`^${shelf.name}/[0-9]{3}.rst$`) }, { sort: { key: -1 } })
      const n = last
        ? parseInt(last.key.substring(shelf.name.length + 1, shelf.name.length + 4)) + 1
        : 1;

      return `${shelf.name}/${n.toString().padStart(3, "0")}.rst`;
    }
    throw new Error("unexpected")
  };

  return {
    async build(
      shelf: Shelf,
      content: string,
      inputName: string
    ): Promise<Omit<Doc, "id">> {
      // TODO: fix api
      const { title } = await client.rst2html(content);

      const doc: Omit<Doc, "id"> = {
        key: generateKey(shelf, inputName),
        title: title ?? '',
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return doc;
    },
  }
}

export default function useMainModel(
  workspace: Workspace,
  client: AsyncWorkerClient,
) {
  return {
    get Documents() { return workspace.Documents },
    get shelves(): Shelf[] { return workspace.shelves },
    async save(shelf: Shelf, key: string, content: string) {
      const builder = createDocBuilder(
        workspace.Documents,
        client,
      );
      const doc = await builder.build(shelf, content, key);
      return workspace.Documents.insert(doc);
    },
    update(doc: Doc) {
      const updates = {
        title: "bar",
        content: "* bar",
        updatedAt: new Date(),
      };
      return workspace.Documents.updateOne(doc, { $set: updates });
    },
    remove(key: string) {
      workspace.Documents.removeOne({ key })
    },
    rst2html(content: string) {
      return client.rst2html(content);
    }
  };
}
