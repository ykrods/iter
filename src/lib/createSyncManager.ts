import type { CollectionItemBase, Doc, IterSyncManager } from "$src/types"

import { SyncManager } from "@signaldb/sync"

import walk from "./fs/walk"
import deserialize from "./doc/deserialize"
import serialize from "./doc/serialize"
import saveFile from "./fs/saveFile"

export default function createSyncManager(
  id: string,
  directoryHandle: FileSystemDirectoryHandle
): IterSyncManager {

  return new SyncManager<{ name: string }, CollectionItemBase, string>({
    id,
    // persistenceAdapter: id => createLocalStorageAdapter(id),
    onError(_, error) {
      console.error(error);
    },
    async pull({ name }) {
      if (name === "documents") {
        // fetch all documents
        const items: Doc[] = []
        for await (const { handle } of walk(directoryHandle, [".rst"])) {
          const file = await handle.getFile();
          const rst = await file.text();
          const doc = await deserialize(rst);
          if (doc) {
            items.push(doc);
          }
        }
        const sorted = items.sort((a, b) => {
          if (a.key === b.key) return 0;
          return (a.key < b.key) ? -1 : 1;
        });
        console.log(`${sorted.length} items were pulled`)
        return { items: sorted }
      }
      return { items: [] }
    },
    async push({ name }, { changes }) {
      if (name === "documents") {
        await Promise.all(changes.added.map(async (item) => {
          const doc: Doc = item as Doc;
          const text = serialize(doc);
          await saveFile(directoryHandle, doc.key, text)
        }))
        await Promise.all(changes.modified.map(async (item) => {
          console.log(item)
        }))
        await Promise.all(changes.removed.map(async (item) => {
          console.log(item)
        }))
      }
    }
  })
}
