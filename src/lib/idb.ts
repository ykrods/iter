import type { Project } from "$src/types"


export function open(
  name: string,
  version: number,
  upgrade: (db: IDBDatabase) => any
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open(name, version);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => upgrade(request.result);
    request.onsuccess = (event: Event) => resolve(request.result);
    request.onerror = (event: Event) => reject(request.error);
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
    request.onsuccess = event => resolve(request.result);
    request.onerror = event => reject(request.error);
  });
}

export function getDB() {
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
      async put(item: Project) {
        const db = await openDB()
        return request(() => store(db).put(item));
      },
      async clear() {
        const db = await openDB()
        return request(() => store(db).clear());
      }
    }
  }
}
