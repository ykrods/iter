import { writable } from "svelte/store";

import { Project } from "./models/project.js";

export const projects = (() => {
  const { subscribe, set } = writable(undefined);

  return {
    subscribe,
    async reload() {
      set(await Project.list());
    },
  };
})();

export const currentProject = writable(null);
