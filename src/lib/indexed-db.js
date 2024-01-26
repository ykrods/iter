/**
 * low layer IndexedDB
 */

/**
 * @param {string} name
 * @param {number} version
 * @param {function(IDBDatabase):any} upgrade
 * @return {Promise<IDBDatabase>}
 */
export async function open(name, version, upgrade) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = (event) => upgrade(request.result);
    request.onsuccess = (event) => resolve(request.result);
    request.onerror = (event) => reject(request.error);
  });
}

export function getStore(db, name, mode = "readwrite") {
  const tx = db.transaction(name, mode);
  return tx.objectStore(name);
}

export async function request(builder) {
  return new Promise((resolve, reject) => {
    const request = builder();
    request.onsuccess = event => resolve(event.target.result);
    request.onerror = event => reject(event.target.error);
  });
}

export async function getAll(db, name) {
  const s = getStore(db, name);
  return request(() => s.getAll());
}

export async function get(db, name, id) {
  const s = getStore(db, name);
  return request(() => s.get(id));
}

export async function put(db, name, object) {
  const s = getStore(db, name);
  return request(() => s.put(object));
}

export async function clear(db, name) {
  const s = getStore(db, name);
  return request(() => s.clear());
}
