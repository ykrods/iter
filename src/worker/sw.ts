import type {
  PyodideInterface,
  loadPyodide as loadPyodide_orig,
} from "pyodide";

declare global {
  var loadPyodide: typeof loadPyodide_orig
}

import display_versions from "./display_versions.py?raw";
import rst2html_py from "./rst2html.py?raw";
// import gen_pygments_style from "./gen_pygments_style.py?raw";
import mermaid_py from "./mermaid.py?raw";

import localFileResponse from "./localFileResponse";

importScripts("/_/static/pyodide/pyodide.js");

let pyodide: PyodideInterface;


let pyodideReadyPromise = (async () => {
  pyodide = await loadPyodide();

  // TODO: serve wheel files
  await pyodide.loadPackage([
    "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/docutils-0.21.1-py3-none-any.whl",
    "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pygments-2.17.2-py3-none-any.whl"
  ]);

  const oneShotRun = (code: string) => {
    const scope = pyodide.globals.get("dict")();
    const result = pyodide.runPython(code, { globals: scope });
    scope.destroy();
    return result;
  };

  oneShotRun(display_versions);
  // save as pygments-default.css
  // console.log(oneShotRun(gen_pygments_style));

  pyodide.runPython(rst2html_py);
  pyodide.runPython(mermaid_py)
  pyodide.runPython("setup_mermaid()");
})();


self.addEventListener('install', async (event: ExtendableEvent) => {
  console.log("install");

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

self.addEventListener("message", async (event: MessageEvent) => {
  const { _type, args } = event.data;

  const handlers: Record<string, (...args: any) => Promise<any>> = {
    rst2html: async (rst: string) => {
      // make sure loading is done
      await pyodideReadyPromise;

      return pyodide.runPython("rst2html")(rst);
    },
  };

  if (Object.keys(handlers).includes(_type)) {
    try {
      const result = await handlers[_type](...args);
      event.source?.postMessage(Object.assign(event.data, { result }));
    } catch(error) {
      console.error(error);
      event.source?.postMessage(Object.assign(event.data, { error }));
    }
  }
});

self.addEventListener("fetch", (event: FetchEvent) => {
  const url = new URL(event.request.url);

  if (url.origin !== location.origin) {
    return;
  }

  const re = new RegExp("^/raw/(?<projectId>[^/]+)/(?<key>.*)$");
  const match = url.pathname.match(re);
  if (!match) {
    return;
  }
  const projectId = decodeURIComponent(match.groups!.projectId);
  const key = decodeURIComponent(match.groups!.key);

  event.respondWith(localFileResponse(projectId, key));
});
