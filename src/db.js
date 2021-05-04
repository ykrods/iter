import Dexie from "dexie";
import "dexie-export-import";
import 'dexie-observable';

import { Issue } from "./models/issue.js";
import { Note } from "./models/note.js";
import { WikiPage } from "./models/wiki_page.js";
import { Upload } from "./models/upload.js";
import { CachedHTML } from "./models/cached_html.js";

const prefix = "iter-";

export function getDB(id) {
  const db = new Dexie(getDBName(id));

  db.version(1).stores({
    issues: "id, title, status, created_at, updated_at",
    notes: "id, created_at, updated_at",
    wiki_pages: "path, created_at, updated_at",
  });

  // for upgrading dexie-observable
  db.version(2).stores({});

  db.version(3).stores({
    uploads: "name, created_at, updated_at",
  });

  db.version(4).stores({
    cached_htmls: "key, created_at, updated_at",
  });

  db.issues.mapToClass(Issue);
  db.notes.mapToClass(Note);
  db.wiki_pages.mapToClass(WikiPage);
  db.uploads.mapToClass(Upload);
  db.cached_htmls.mapToClass(CachedHTML);

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
