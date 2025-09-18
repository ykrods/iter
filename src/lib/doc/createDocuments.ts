import type { Doc, Documents } from "$src/types";

import { Collection } from "@signaldb/core";
import svelteReactivityAdapter from "@signaldb/svelte";

export default function createDocuments(): Documents {
  return new Collection<Doc, string>({
    reactivity: svelteReactivityAdapter,
    primaryKeyGenerator: item => item.key,
  });
}
