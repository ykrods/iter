import htmlTemplate from "./html-template.html";

import ProjectRepository from "$src/repositories/project-repository.js";

export default async function workerResponse(projectId, key) {
  try {
    const repo = await ProjectRepository.build()
    const project = await repo.get(projectId);
    const fileHandle = await project.getContent(key);
    const file = await fileHandle.getFile();

    if (key.endsWith(".rst")) {
      return new Response(htmlTemplate, { headers: {"Content-Type": "text/html" }});
    } else {
      return new Response(file, { headers: {"Content-Type": file.type }});
    }
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
