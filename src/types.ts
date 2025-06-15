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

export interface Doc {
  id: string
  name: string
  content: string
  key: string
  lastModified: Date
  createdAt: Date
  updatedAt: Date
}

export type Documents = Collection<Doc, string>
export type IterSyncManager = SyncManager<{ name: string }, Doc, string>

export type OpenedProject = Project & {
  Documents: Documents
  syncManager: IterSyncManager
}

export interface AsyncWorkerClient {
  rst2html(rst: string): Promise<string>
  close(): void
}
