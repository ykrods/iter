import type { Dexie, EntityTable } from "dexie";


export interface Note {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export type IterDB = Dexie & {
  notes: EntityTable<Note, "id">
}

export interface Project {
  id: string
  db: IterDB
  url(rel: string): string
}
