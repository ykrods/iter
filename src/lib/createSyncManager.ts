import type { CollectionItemBase, Doc, IterSyncManager } from "$src/types"

import { SyncManager } from "@signaldb/sync"

import walk from "./fs/walk"
import buildDoc from "./doc/buildDoc"


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
          const doc = await buildDoc(handle);
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
    async push(_, { changes }) {
      await Promise.all(changes.added.map(async (item) => {
        console.log(item)
      }))
      await Promise.all(changes.modified.map(async (item) => {
        console.log(item)
      }))
      await Promise.all(changes.removed.map(async (item) => {
        console.log(item)
      }))
    }
  })
}
