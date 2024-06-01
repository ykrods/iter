import type { Dexie, EntityTable } from "dexie";


export interface Doc {
  key: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface HtmlCache {
  key: string
  html: string
  createdAt: Date
}

export type IterDB = Dexie & {
  docs: EntityTable<Doc, "key">
  html_caches: EntityTable<HtmlCache, "key">
}

export interface Project {
  id: string
  db: IterDB
  url(rel: string): string
}
