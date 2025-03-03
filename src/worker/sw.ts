let pyodide;


self.addEventListener('install', async (event) => {
  console.log("install");

  importScripts("/_/static/pyodide/pyodide.js");

  pyodide = await loadPyodide();
  // TODO: serve wheel files
  await pyodide.loadPackage([
    "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/docutils-0.21.1-py3-none-any.whl",
    "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pygments-2.17.2-py3-none-any.whl"
  ]);

  const oneShotRun = (code) => {
    const scope = pyodide.globals.get("dict")();
    const result = pyodide.runPython(code, { globals: scope });
    scope.destroy();
    return result;
  };

  pyodide.runPython("print(1 + 1)");

  // activate installed worker without
  // waiting for the open page to be closed
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log("activate");
  // activate newest worker without
  // waiting for reloading when registered
  event.waitUntil(clients.claim());
});
