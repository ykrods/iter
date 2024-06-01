<script>
  import { Router } from "svelte-spa-history-router";

  import { getProject } from "$src/lib/project/getProject";

  import Top from "./pages/Top.svelte";
  import NotFound from "./pages/NotFound.svelte";

  function ensureProject(resolver) {
    return async ({ params, props }) => {
      const project = await getProject(params.projectId);
      if (!project) {
        return redirect("/");
      }
      props.project = project;
      return resolver({ params, props })
    }
  }

  const routes = [
    { path: "/", component: Top },
    {
      path: "/(?<projectId>[0-9a-zA-Z][0-9A-Za-z._\-]*)/",
      resolver: ensureProject(({ params, props }) => {
        return import("./pages/Home.svelte");
      })
    },
    { path: ".*", component: NotFound },
  ];
</script>
<Router {routes}/>
