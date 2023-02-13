import { createHandler } from "./web_worker_promise.js";

import rst2html_py from "./rst2html.py";
import mermaid_py from "./mermaid.py";


// XXX: npm パッケージだと docutils を読み込めないのでとりあえず CDN を使う
importScripts("https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js");

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide();
  await self.pyodide.loadPackage(["docutils"]);

  self.pyodide.runPython(rst2html_py);
  self.pyodide.runPython(mermaid_py);
  self.pyodide.runPython("setup_mermaid()")
}

let pyodideReadyPromise = loadPyodideAndPackages();


async function rst2html(rst) {
  // make sure loading is done
  await pyodideReadyPromise;

  return self.pyodide.runPython("rst2html")(rst);
}


self.onmessage = createHandler(self, { rst2html });
