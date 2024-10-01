import type { Dexie, EntityTable } from "dexie";


export interface Note {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface HtmlCache {
  id: string
  html: string
  createdAt: Date
}

export type IterDB = Dexie & {
  notes: EntityTable<Note, "id">
  html_caches: EntityTable<HtmlCache, "id">
}

export interface Project {
  id: string
  db: IterDB
  url(rel: string): string
}
