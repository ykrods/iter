<script>
  import { Router, redirect } from "svelte-spa-history-router";

  import NotFound from "$src/pages/NotFound.svelte";
  import ProjectRepository from "$src/repositories/project-repository.js";

  async function ensureProject(route, content) {
    const id = decodeURIComponent(route.params.projectId);
    const repository = await ProjectRepository.build();
    const project = await repository.get(id);

    if (!project) {
      return redirect("/");
    }
    route.props.project = project;
    return content(route);
  }

  const routes = [
    { path: "/", resolver: () => import("$src/pages/Top.svelte") },
    // /p/ はサービスワーカーがレスポンスを返すので、通常ルーティングしない
    {
      path: `/p/(?<projectId>[%0-9a-zA-Z_-]+)/(?<key>.*)`,
      resolver: (route) => ensureProject(route, (route) => redirect("/")),
    },
    {
      path: `/a/(?<projectId>[%0-9a-zA-Z_-]+)/(?<key>.*)`,
      resolver: (route) => ensureProject(route, (route) => {
        return import("$src/pages/Browser.svelte");
      }),
    },
    { path: ".*", component: NotFound },
  ];
</script>
<Router {routes}/>
