import DOMPurify from "dompurify/dist/purify.es.js";

import { promisify } from "./web_worker_promise.js";

const asyncMessage = promisify(new Worker("/_/worker.js"));

export async function rst2html(rst) {
  const html = await asyncMessage("rst2html", rst);
  // DOMPurify は window オブジェクトを参照するので worker 外でサニタイズする
  return DOMPurify.sanitize(html);
}
