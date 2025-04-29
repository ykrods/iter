import type {
  PyodideInterface,
  loadPyodide as loadPyodide_orig,
} from "pyodide";

declare global {
  var loadPyodide: typeof loadPyodide_orig
}

importScripts("/_/static/pyodide/pyodide.js");

let pyodide: PyodideInterface;


let pyodideReadyPromise = (async () => {
  pyodide = await loadPyodide();

  // TODO: serve wheel files
  await pyodide.loadPackage([
    "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/docutils-0.21.1-py3-none-any.whl",
    "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pygments-2.17.2-py3-none-any.whl"
  ]);

  const oneShotRun = (code: string) => {
    const scope = pyodide.globals.get("dict")();
    const result = pyodide.runPython(code, { globals: scope });
    scope.destroy();
    return result;
  };

  // oneShotRun(display_versions);
  // save as pygments-default.css
  // console.log(oneShotRun(gen_pygments_style));

  // pyodide.runPython(rst2html_py);
})();

self.addEventListener('install', async (event: ExtendableEvent) => {
  console.log("install");

  await pyodideReadyPromise;
  pyodide.runPython("print(1 + 1)");

  // TODO: Create cache

  // activate installed worker without
  // waiting for the open page to be closed
  self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log("activate");
  // activate newest worker without
  // waiting for reloading when registered
  event.waitUntil(clients.claim());
});
