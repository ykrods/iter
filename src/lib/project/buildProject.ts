import type { Dexie } from "dexie";

import type { Project } from "$src/types";


export function buildProject(id: string, db: Dexie): Project {
  return {
    id,
    db,
    url(rel="/") {
      return `/${id}${rel}`;
    }
  }
}
