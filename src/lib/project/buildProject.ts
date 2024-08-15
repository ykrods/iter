import type { Project, IterDB } from "$src/types";


export function buildProject(id: string, db: IterDB): Project {
  return {
    id,
    db,
    url(rel="/") {
      return `/${id}${rel}`;
    }
  }
}
