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
