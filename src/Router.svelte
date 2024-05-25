<script>
  import { Router } from "svelte-spa-history-router";

  import Top from "./pages/Top.svelte";
  import NotFound from "./pages/NotFound.svelte";

  const routes = [
    { path: "/", component: Top },
    { path: ".*", component: NotFound },
  ];
</script>
<Router {routes}/>
