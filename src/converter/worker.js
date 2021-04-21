/**
 * Web worker to convert reStructuredText
 *
 * messaging roles
 *
 * - if receiving message.data contains `_id`, worker should add
 *   `_reply: _id` property to the corresponding message.
 */
import { Queue } from "promise-job-queue";
import publish_parts from "./publish_parts.py";
import mermaid from "./mermaid.py";

/**
 * Queue roles
 *
 * - This worker use `pyodide.globals` to pass rst to pyodide,
 *   so it should handle messages sequentially.
 * - Enable to receive messages while pyodide is loading.
 *   and ensure that messages will be handled after loading has finished.
 */
let q = new Queue();
q.add(setup);

async function setup() {
  self.addEventListener("message", (msg) => {
    if (msg.data.type === "rst") {
      q.add(rst2html, msg.data.rst, msg.data._id);
    }
  });

  const PYODIDE_PATH = "/vendor/pyodide-0.16.1-slim";
  // pyodide sub resources
  self.languagePluginUrl = `http://localhost:8080${PYODIDE_PATH}/`;

  importScripts(`${PYODIDE_PATH}/pyodide.js`);

  await self.languagePluginLoader;
  await pyodide.loadPackage("docutils");
  await pyodide.loadPackage("Pygments");
  pyodide.runPython(publish_parts);
  pyodide.runPython(mermaid);
  pyodide.runPython("setup_mermaid()")
  console.log("ready");
}

async function rst2html(rst, _id) {
  // XXX: This API will change next release (v0.17.x)
  pyodide.globals.rst = rst;
  //pyodide.globals.set("rst", msg.data.rst);

  const html = pyodide.runPython("rst2html(rst)");
  self.postMessage({ _reply: _id, type: "html", html, rst });
}
