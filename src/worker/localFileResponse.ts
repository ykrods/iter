import type { Project, IterIDB } from "$src/types";

import { getDB } from "$src/lib/idb";
import { recursiveFileHandle } from "$src/lib/recursiveFileHandle";

export default async function localFileResponse(
  projectId: string,
  key: string
) {
  const idb: IterIDB = getDB();
  const project: Project = await idb.projects.get(projectId);
  try {
    const fileHandle = await recursiveFileHandle(project.handle, key);
    const file = await fileHandle.getFile();

    return new Response(file, { headers: {"Content-Type": file.type }});
  } catch (error) {
    console.error(error);
    return new Response(
      "Not Found (SW)",
      {
        status: 404,
        headers: {"Content-Type": "text/plain" },
      },
    );
  }
}
