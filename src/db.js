import Dexie from "dexie";
import "dexie-export-import";

const prefix = "iter-";

export function getDB(id) {
  const db = new Dexie(getDBName(id));

  db.version(1).stores({
    journal: "id, created_at, updated_at",
  });

  return db;
}

export function getDBName(id) {
  return `${prefix}${id}`;
}

export async function getDatabaseIds() {
  const dbnames = await Dexie.getDatabaseNames();
  return dbnames
    .filter((dbname) => dbname.startsWith(prefix))
    .map((dbname) => dbname.replace(prefix, ""));
}
