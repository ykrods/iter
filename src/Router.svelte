<script lang="ts">
  import { Router, redirect } from "svelte-spa-history-router";
  import Top from "./pages/Top.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import { getDB } from "$src/lib/idb";

  let idb: IterIDB = getDB();

  async function mainResolver(params: { projectId: string }) {
    const component = (await import("./pages/Main.svelte")).default
    const project = await idb.projects.get(params.projectId);
    if (project) {
      return { component, props: { project }};
    } else {
      return redirect("/");
    }
  }

  const routes = [
    { path: "/", component: Top },
    {
      path: "/(?<projectId>([^/]|\S)+)/",
      resolver: mainResolver,
    },
    { path: ".*", component: NotFound },
  ];
</script>
<Router {routes}/>
