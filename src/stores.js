import { writable } from "svelte/store";

export const snackbarMessage = (() => {
  const { subscribe, set } = writable(null);

  return {
    subscribe,
    info(message) {
      set({ message, level: "info" });
    },
    warning(message) {
      set({ message, level: "warning" });
    },
    error(message) {
      set({ message, level: "error" });
    },
    clear() {
      set(null);
    },
  };
})();

// issue list filter
export const selectedStatuses = writable(["OPEN"]);

export const dbEvents = (() => {
  const { subscribe, set } = writable([]);

  let db = null;

  function change2event(change) {
    const event = {};
    switch(change.table) {
    case 'issues':
      event.model = "Issue";
      break;
    case 'wiki_pages':
      event.model = "WikiPage";
      break;
    case "notes":
      event.model = "Note";
      break;
    default:
      return undefined;
    }
    switch(change.type) {
    case 1: // CREATED
      event.op = "CREATED";
      event.obj = change.obj;
      break;
    case 2: // UPDATED
      event.op = "UPDATED";
      event.obj = change.obj;
      break;
    case 3: // DELETED
      event.op = "DELETED";
      event.obj = change.oldObj;
      break;
    }
    return event;
  }

  return {
    subscribe,
    listen(_db) {
      db = _db;
      // ? How to remove listener
      db.on('changes', (changes) => {
        const events = changes.map(change2event).filter(e => e);
        if (events.length) {
          set(events);
        }
      });
    }
  };
})();

export const currentProject = (() => {
  const { subscribe, set } = writable(null);

  return {
    subscribe,
    set(project) {
      set(project);
      if (project) {
        dbEvents.listen(project.db);
      }
    }
  };
})();
