import Dexie from "dexie";

import type { IterDB } from "$src/types";


const prefix = "iter-";

function getMigratedDB(dbname: string): IterDB {
  const db = new Dexie(dbname) as IterDB;

  db.version(1).stores({
    docs: "key, createdAt, updatedAt",
    html_caches: "key",
  });

  return db;
}

export async function getDB(id: string): Promise<IterDB> {
  const exists = await Dexie.exists(getDBName(id));
  if (!exists) {
    throw new Error("DoesNotExists");
  }
  return getMigratedDB(getDBName(id));
}

export async function createDB(id: string): Promise<IterDB> {
  const db = getMigratedDB(getDBName(id));
  await db.open();
  return db;
}

export function getDBName(id: string): string {
  return `${prefix}${id}`;
}

export async function getDatabaseIds(): Promise<string[]> {
  const dbnames = await Dexie.getDatabaseNames();
  return dbnames
    .filter((dbname) => dbname.startsWith(prefix))
    .map((dbname) => dbname.replace(prefix, ""));
}
