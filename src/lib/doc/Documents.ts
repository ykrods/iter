import type { Doc } from "$src/types";

import { Collection } from "@signaldb/core";
import svelteReactivityAdapter from "@signaldb/svelte";


const Documents = new Collection<Doc>({
  reactivity: svelteReactivityAdapter
})
export default Documents;
