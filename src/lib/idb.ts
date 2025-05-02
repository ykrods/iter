import type { Project, IterIDB } from "$src/types"

export function open(
  name: string,
  version: number,
  upgrade: (db: IDBDatabase) => any
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open(name, version);

    request.onupgradeneeded = () => upgrade(request.result);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function getStore(
  db: IDBDatabase,
  name: string,
  mode: IDBTransactionMode = "readwrite"
) {
  const tx = db.transaction(name, mode);
  return tx.objectStore(name);
}

export function request<T>(builder: () => IDBRequest<T>): Promise<T>{
  return new Promise((resolve, reject) => {
    const request = builder();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function getDB(): IterIDB {
  let _db: IDBDatabase;

  const dbname = "iter";
  const version = 2;
  const upgrade = (db: IDBDatabase) => {
    db.createObjectStore("projects", { keyPath: "id" });
  };

  const openDB = async () => {
    if (!_db) {
      _db = await open(dbname, version, upgrade);
    }
    return _db;
  }

  const store = (db: IDBDatabase) => getStore(db, "projects");

  return {
    projects: {
      async getAll(): Promise<Project[]> {
        const db = await openDB()
        return request(() => store(db).getAll());
      },
      async get(id: string): Promise<Project> {
        const db = await openDB()
        return request(() => store(db).get(id));
      },
      async put(item: Project): Promise<IDBValidKey> {
        const db = await openDB()
        return request(() => store(db).put(item));
      },
      async clear(): Promise<undefined> {
        const db = await openDB()
        return request(() => store(db).clear());
      }
    }
  }
}
