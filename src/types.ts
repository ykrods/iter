import type { Collection } from "@signaldb/core";
import type { SyncManager } from "@signaldb/sync";


export type Project = {
  id: string
  handle: FileSystemDirectoryHandle
  openedAt: Date
}

export interface IterIDB {
  projects: {
    getAll(): Promise<Project[]>
    get(id: string): Promise<Project>
    put(item: Project): Promise<IDBValidKey>
    clear(): Promise<undefined>
  }
}

export interface CollectionItemBase {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface Doc extends CollectionItemBase {
  key: string
  title: string
  content: string
}

export type Documents = Collection<Doc, string>
export type IterSyncManager = SyncManager<
  { name: string },
  CollectionItemBase,
  string
>

export type Workspace = {
  project: Project,
  syncManager: IterSyncManager,
  Documents: Documents,
  shelves: Shelf[],
}

export interface Shelf {
  type: "folder" | "note" | "serial"
  name: string
}

export interface AsyncWorkerClient {
  rst2html(rst: string): Promise<{ title: string, html: string}>
  close(): void
}

export type Updates<T> = Partial<Omit<T, "id" | "key" | "createdAt">>
