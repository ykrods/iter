import ProjectRepository from "$src/repositories/project-repository.js";

export default async function workerResponse(pyodide, projectId, key) {
  try {
    const repo = await ProjectRepository.build()
    const project = await repo.get(projectId);
    const fileHandle = await project.getContent(key);
    const file = await fileHandle.getFile();

    if (key.endsWith(".rst")) {
      const html = await pyodide.runPython("rst2html")(await file.text());
      const tpl = `<!DOCTYPE html>
<html>
<head>
  <link rel='stylesheet' href='/viewer.css'/>
  <link rel="stylesheet" href="/math.css"/>
  <link rel="stylesheet" href="/pygments-default.css"/>
  <style>
    html { overflow: hidden; }
    body { margin: 0; }
  </style>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10.7.0/+esm';
    mermaid.initialize({ startOnLoad: true });
  </script>
</head>
<body>
${html}
</body>
</html>`;
      return new Response(tpl, { headers: {"Content-Type": "text/html" }});
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
