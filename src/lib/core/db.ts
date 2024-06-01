import Dexie from "dexie";


const prefix = "iter-";

function getMigratedDB(dbname: strin): Dexie {
  const db = new Dexie(dbname);

  db.version(1).stores({
    issues: "id, title, status, created_at, updated_at",
  });

  return db;
}

export async function getDB(id: string): Promise<Dexie> {
  const exists = await Dexie.exists(getDBName(id));
  if (!exists) {
    throw new Error("DoesNotExists");
  }
  return getMigratedDB(getDBName(id));
}

export async function createDB(id: string): Dexie {
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
