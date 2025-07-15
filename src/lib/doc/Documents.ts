import type { Doc, Documents } from "$src/types";

import { Collection } from "@signaldb/core";
import svelteReactivityAdapter from "@signaldb/svelte";

import { generateId } from "$src/lib/id";

export function createDocuments(): Documents {
  return new Collection<Doc, string>({
    reactivity: svelteReactivityAdapter,
    primaryKeyGenerator: () => generateId(),
  });
}
