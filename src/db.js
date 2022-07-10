import Dexie from "dexie";
import "dexie-export-import";

import { Journal } from "./models/journal.js";

const prefix = "iter-";

export function getDB(id) {
  const db = new Dexie(getDBName(id));

  db.version(1).stores({
    journals: "id, created_at, updated_at",
  });

  db.journals.mapToClass(Journal);

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
