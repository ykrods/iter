class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

function build() {
  let worker = new Worker("/converter.js");

  const pool = [];
  let count = 0;

  function asyncMessage(msg) {
    const deferred = new Deferred();
    const _id = count++;
    pool.push({ _id, deferred });

    worker.postMessage(Object.assign(msg, { _id }));

    return deferred.promise;
  }

  worker.addEventListener("message", (msg) => {
    const idx = pool.findIndex((o) => o._id === msg.data._reply);
    if (idx !== -1) {
      pool[idx].deferred.resolve(msg.data);
      pool.splice(idx, 1);
      console.log(`pool: ${pool.length}`);
    }
  });

  return {
    async rst2html(rst) {
      const response = await asyncMessage({ type: "rst", rst });
      return response.html;
    },
  };
}

const _build = build();

export const rst2html = _build.rst2html;
