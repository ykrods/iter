import type { Project } from "$src/types";

import { getDB } from "$src/lib/core/db";
import { buildProject } from "./buildProject";


export async function getProject(id: string): Promise<Project> {
  const db = await getDB(id);

  return buildProject(id, db);
}
