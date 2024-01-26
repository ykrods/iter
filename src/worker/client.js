import DOMPurify from "dompurify/dist/purify.es.mjs";

import { Deferred } from "$src/lib/deferred.js";

/**
 * @param {Worker} worker
 * @return {function(string, ...*): Promise<*>} asyncMessage
 *
 */
export const initAsyncMessage = (() => {
  const pool = {};
  let _id = 0;
  let init = true;

  return (worker, type) => {
    function asyncMessage(type, ...args) {
      const deferred = new Deferred();

      pool[++_id] = deferred;

      worker.controller.postMessage({ type, args, _id });

      return deferred.promise;
    }
    // console.log(`init: ${init}`);

    if (init) {
      worker.addEventListener("message", (message) => {
        const deferred = pool[message.data._id];
        delete pool[message.data._id];

        if (deferred) {
          if (!message.data.error) {
            deferred.resolve(message.data.result || null);
          } else {
            deferred.reject(message.data.error);
          }
        }
        // console.log(`pool size: ${Object.keys(pool).length}`);
      });
      init = false;
    }

    const calls = {
      rst2html: async (rst) => {
        const html = await asyncMessage("rst2html", rst);
        // DOMPurify は window オブジェクトを参照するのでここでサニタイズする
        return DOMPurify.sanitize(html);
      }
    }
    return calls[type];
  };
})();
