class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}


/**
 *  How To Use
 *
 *  ```
 *  // on client
 *  const asyncMessage = promisify(new Worker('worker.js'))
 *  const result = await asyncMessage("sum", 1, 2);
 *  ```
 */
export function promisify(worker) {
  const pool = {};
  let _id = 0;

  function asyncMessage(type, ...args) {
    const deferred = new Deferred();

    pool[++_id] = deferred;

    worker.postMessage({ type, args, _id });

    return deferred.promise;
  }

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
    console.log(`pool size: ${Object.keys(pool).length}`);
  });

  return asyncMessage;
}


/**
 * How To Use
 *
 * // on worker
 * onmessage = createHandler({ sum });
 * function sum(a,b) { return a + b }
 */
export function createHandler(self, handler) {
  return async (message) => {
    const { type, args } = message.data;
    if (handler[type] instanceof Function) {
      try {
        const result = await handler[type](...args);
        self.postMessage(Object.assign(message.data, { result }));
      } catch(error) {
        self.postMessage(Object.assign(message.data, { error }));
      }
    } else {
      self.postMessage(Object.assign(message.data, { error: new Error(`Unavailable message: ${type}`) }));
    }
  };
}
