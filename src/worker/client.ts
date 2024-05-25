// @ts-ignore
import DOMPurify from "dompurify/dist/purify.es.mjs";


export function asyncWorkerClient(worker: ServiceWorkerContainer) {
  const pool: Record<string, any> = {};

  function asyncMessage(_type: string, ...args: any[]) {
    const _id = 'id' + (new Date()).getTime();

    pool[_id] = Promise.withResolvers();

    worker.controller?.postMessage({ _type, args, _id });

    return pool[_id].promise;
  }

  const onMessage = (message: MessageEvent) => {
    const _id = message.data._id;

    if (!pool.hasOwnProperty(_id)) {
      return;
    }
    const { resolve, reject } = pool[_id];

    delete pool[_id];

    if (!message.data.error) {
      resolve(message.data.result || null);
    } else {
      reject(message.data.error);
    }
    // console.log(`pool size: ${Object.keys(pool).length}`);
  };

  worker.addEventListener("message", onMessage);

  return {
    rst2html: async (rst: string) => {
      const html = await asyncMessage("rst2html", rst);
      // DOMPurify は window オブジェクトを参照するのでここでサニタイズする
      return DOMPurify.sanitize(html);
    },
    close() {
      worker.removeEventListener("message", onMessage);
    }
  }
}
