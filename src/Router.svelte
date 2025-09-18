<script lang="ts">
  import type { Route } from "svelte-spa-history-router";

  import type { IterIDB } from "$src/types";
  import type Main from "$src/pages/Main.svelte";

  import { Router, redirect } from "svelte-spa-history-router";
  import Top from "./pages/Top.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import { getDB } from "$src/lib/idb";
  import useAppState from "./useAppState.svelte";

  const appState = useAppState(getDB());

  async function mainResolver(params: Record<string, string>) {
    const component = (await import("./pages/Main.svelte")).default
    try {
      await appState.openProject(params.projectId);
      return { component, props: { appState }};
    } catch(e) {
      return redirect("/");
    }
  }

  type Routes = [
    Route<typeof Top>,
    Route<typeof Main>,
    Route<typeof NotFound>,
  ];

  const routes: Routes = [
    { path: "/", component: Top },
    {
      path: "/(?<projectId>([^/]|\S)+)/",
      resolver: mainResolver,
    },
    { path: ".*", component: NotFound },
  ];
</script>
<Router {routes}/>
