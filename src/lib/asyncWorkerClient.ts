import type { AsyncWorkerClient } from "$src/types"

function generateId(): string {
  const ary = new Uint32Array(1);
  crypto.getRandomValues(ary);
  return ary[0].toString(16);
}

export default function asyncWorkerClient(
  worker: ServiceWorkerContainer
): AsyncWorkerClient {
  const pool: Record<string, any> = {};
  const clientId = generateId();
  let count = 0;

  function asyncMessage(_type: string, ...args: any[]) {
    const _id = `id:${(new Date()).getTime()}-${clientId}-${count++}`;
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
      return asyncMessage("rst2html", rst);
    },
    close() {
      worker.removeEventListener("message", onMessage);
    }
  }
}
