<script>
  import { Router, redirect } from "svelte-spa-history-router";

  import NotFound from "$src/pages/NotFound.svelte";

  const routes = [
    { path: "/", resolver: () => import("$src/pages/Top.svelte") },
    { path: ".*", component: NotFound },
  ];
</script>
<Router {routes}/>
