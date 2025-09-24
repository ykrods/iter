<script lang="ts">
  import type { Route } from "svelte-spa-history-router";
  import type { IterIDB } from "$src/types";
  import type Main from "$src/pages/Main.svelte";
  import type Document from "$src/pages/Document.svelte";

  import { setContext } from "svelte";
  import { Router, redirect } from "svelte-spa-history-router";
  import Top from "./pages/Top.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import { getDB } from "$src/lib/idb";
  import useAppState from "./useAppState.svelte";

  const appState = useAppState(getDB());
  setContext("appState", appState);

  async function mainResolver(params: Record<string, string>) {
    const component = (await import("./pages/Main.svelte")).default
    try {
      await appState.openProject(params.projectId);
      return { component, props: {} };
    } catch(e) {
      return redirect("/");
    }
  }

  async function docResolver(params: Record<string, string>) {
    const component = (await import("./pages/Document.svelte")).default
    try {
      await appState.openProject(params.projectId);
      const Documents = appState.workspace!.Documents;
      return {
        component,
        props: {
          projectId: params.projectId,
          key: params.key,
          getCursor: () => Documents.findOne({ key: params.key })
        },
      };
    } catch(e) {
      return redirect("/");
    }
  }

  type Routes = [
    Route<typeof Top>,
    Route<typeof Main>,
    Route<typeof Document>,
    Route<typeof NotFound>,
  ];

  const routes: Routes = [
    { path: "/", component: Top },
    {
      path: "/(?<projectId>([^/]|\S)+)/",
      resolver: mainResolver,
    },
    {
      path: "/(?<projectId>([^/]|\S)+)/(?<key>.+\.rst)",
      resolver: docResolver,
    },
    { path: ".*", component: NotFound },
  ];
</script>
<Router {routes}/>
