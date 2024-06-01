import type { Project } from "$src/types";

import { createDB } from "$src/lib/core/db";
import { buildProject } from "./buildProject";


export async function createProject(id: string): Promise<Project> {
  const db = await createDB(id);
  return buildProject(id, db);
}
