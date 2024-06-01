import type { Dexie } from "dexie";

export interface Project {
  id: string
  db: Dexie
  url(rel: string): string
}
