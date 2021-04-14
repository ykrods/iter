import Dexie from "dexie";

import { Issue } from "./models/issue.js";
import { Note } from "./models/note.js";

const prefix = "iter-";

export function getDB(id) {
  const db = new Dexie(getDBName(id));

  db.version(1).stores({
    issues: "id, title, status, created_at, updated_at",
  });
  db.version(2).stores({
    notes: "id, created_at, updated_at",
  });

  db.issues.mapToClass(Issue);
  db.notes.mapToClass(Note);

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
