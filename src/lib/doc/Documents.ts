import type { Doc } from "$src/types";

import { Collection } from "@signaldb/core";
import svelteReactivityAdapter from "@signaldb/svelte";

import { generateId } from "$src/lib/id";


const Documents = new Collection<Doc>({
  reactivity: svelteReactivityAdapter,
  primaryKeyGenerator: () => generateId(),
})
export default Documents;
