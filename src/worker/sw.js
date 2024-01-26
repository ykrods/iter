import workerResponse from "./worker-response.js";
import rst2html_py from "./rst2html.py";
import mermaid_py from "./mermaid.py";
import gen_pygments_style from "./gen_pygments_style.py";
import display_versions from "./display_versions.py";

// XXX: npm パッケージだと docutils を読み込めないのでとりあえず CDN を使う
importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

let pyodideReadyPromise = (async () => {
  self.pyodide = await loadPyodide();
  await self.pyodide.loadPackage(["docutils", "Pygments"]);

  const oneShotRun = (code) => {
    const scope = self.pyodide.globals.get("dict")();
    const result = self.pyodide.runPython(code, { globals: scope });
    scope.destroy();
    return result;
  };

  oneShotRun(display_versions);
  // save as pygments-default.css
  // console.log(oneShotRun(gen_pygments_style));

  self.pyodide.runPython(rst2html_py);
  self.pyodide.runPython(mermaid_py);
  self.pyodide.runPython("setup_mermaid()")
})();


self.addEventListener('install', (event) => {
  console.log("install");
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log("activate");
  // event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // console.log(`service worker: fetch ${event.request.url}`);

  const url = new URL(event.request.url);

  if (url.origin !== location.origin) {
    return;
  }

  const re = new RegExp("^/p/(?<projectId>[0-9a-z-]+)/(?<key>.*)$");
  const match = url.pathname.match(re);
  if (!match) {
    return;
  }
  const key = decodeURIComponent(/** @type string */(match.groups?.key));

  event.respondWith(
    pyodideReadyPromise.then(() => {
      return workerResponse(match.groups?.projectId, key);
    })
  );
});


self.addEventListener("message", async (event) => {
  const { type, args } = event.data;

  const handlers = {
    rst2html: async (rst) => {
      // make sure loading is done
      await pyodideReadyPromise;

      return self.pyodide.runPython("rst2html")(rst);
    },
  };

  if (handlers[type] instanceof Function) {
    try {
      const result = await handlers[type](...args);
      event.source?.postMessage(Object.assign(event.data, { result }));
    } catch(error) {
      event.source?.postMessage(Object.assign(event.data, { error }));
    }
  }
});
