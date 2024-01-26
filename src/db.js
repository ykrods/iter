import * as idb from "$src/lib/indexed-db.js";


export const getDB = (() => {
  const dbname = "iter";
  const version = 2;
  const upgrade = (db) => {
    db.createObjectStore("projects", { keyPath: "id" });
  };

  let _db = null;

  return async () => {
    if (!_db) {
      _db = await idb.open(dbname, version, upgrade);
    }
    return _db;
  }
})();
