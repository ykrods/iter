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

export type Updates<T> = Partial<Omit<T, "id" | "key" | "createdAt">>

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

export interface WorkspaceState {
  readonly openSidebar: boolean
  toggleSidebar(): void
  readonly shelves: Shelf[]
  shelfUrl(shelf: Shelf): string
  getOpenCreateDocDialog(shelf: Shelf): boolean
  setOpenCreateDocDialog(shelf: Shelf, v: boolean): void
  saveDoc(shelf: Shelf, key: string, content: string): Promise<any>
  readonly Documents: Documents
  docUrl(doc: Doc): string
}

export interface AppState {
  readonly selected: Project | undefined
  readonly workspace: Workspace | undefined
  openProject(name: string): Promise<Workspace | undefined>
  requestAccessPermission(): Promise<any>
  readonly workspaceState: WorkspaceState | undefined
}
