import { writable } from "svelte/store";

export const currentProject = writable(null);

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
