import display_versions from "./display_versions.py?raw";
import rst2html_py from "./rst2html.py?raw";

// XXX: npm パッケージだと docutils を読み込めないのでとりあえず CDN を使う
importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js");


let pyodide;

let pyodideReadyPromise = (async () => {
  pyodide = await loadPyodide();
  await pyodide.loadPackage(["docutils", "Pygments"]);

  const oneShotRun = (code) => {
    const scope = pyodide.globals.get("dict")();
    const result = pyodide.runPython(code, { globals: scope });
    scope.destroy();
    return result;
  };

  oneShotRun(display_versions);
  // save as pygments-default.css
  // console.log(oneShotRun(gen_pygments_style));

  pyodide.runPython(rst2html_py);
  // pyodide.runPython(mermaid_py);
  // pyodide.runPython("setup_mermaid()")
})();


self.addEventListener('install', (event) => {
  console.log("install");
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log("activate");
  // event.waitUntil(clients.claim());
});

self.addEventListener("message", async (event) => {
  const { _type, args } = event.data;

  const handlers = {
    rst2html: async (rst) => {
      // make sure loading is done
      await pyodideReadyPromise;

      return pyodide.runPython("rst2html")(rst);
    },
  };

  if (handlers[_type] instanceof Function) {
    try {
      const result = await handlers[_type](...args);
      event.source?.postMessage(Object.assign(event.data, { result }));
    } catch(error) {
      event.source?.postMessage(Object.assign(event.data, { error }));
    }
  }
});
