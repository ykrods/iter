import type { Project } from "$src/types";

import { getDatabaseIds } from "$src/lib/core/db"
import { getProject } from "./getProject";

export async function getAllProjects(): Promise<Project[]> {
  const ids = await getDatabaseIds();
  return Promise.all(ids.map(id => getProject(id)));
}
