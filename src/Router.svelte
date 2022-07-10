<script>
  import { Router, redirect } from "svelte-spa-history-router";

  import { Project } from "./models/project.js";

  import Top from "./pages/Top.svelte";
  import NotFound from "./pages/NotFound.svelte";

  function routeUnderProject(relpath, _resolver) {
    return {
      path: `/(?<projectId>[0-9a-zA-Z_-]+)${relpath}`,
      resolver: async (route) => {
        const id = route.params.projectId;

        if (!(await Project.exists(id))) {
          return redirect("/");
        }
        const project = new Project(id);
        route.props.project = project;

        return await _resolver(route);
      },
    };
  }

  const routes = [
    {
      path: "/",
      resolver: async (route) => {
        route.props.projects = await Project.list();
        return Top;
      },
    },
    routeUnderProject("/journals", () => import("./pages/Journals.svelte")),
    routeUnderProject("/decisions", () => import("./pages/Decisions.svelte")),
    { path: "/credits", resolver: () => { return import("./pages/Credits.svelte"); } },
    { path: ".*", component: NotFound },
  ];
</script>
<Router {routes}/>
