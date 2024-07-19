<script>
  import { Router, redirect } from "svelte-spa-history-router";

  import { getProject } from "$src/lib/project/getProject";

  import Top from "./pages/Top.svelte";
  import NotFound from "./pages/NotFound.svelte";

  function projectPath(relpath) {
    return `/(?<projectId>[0-9a-zA-Z][0-9A-Za-z._\-]*)/${relpath}`;
  }

  function ensureProject(resolver) {
    return async ({ params, props }) => {
      try {
        props.project = await getProject(params.projectId);
        return resolver({ params, props });
      } catch (e) {
        return redirect("/");
      }
    }
  }

  const routes = [
    { path: "/", component: Top },
    {
      path: projectPath(""),
      resolver: ensureProject(({ params, props }) => {
        return import("./pages/Home.svelte");
      })
    },
    {
      path: projectPath("notes"),
      resolver: ensureProject(({ params, props }) => {
        return import("./pages/NoteList.svelte");
      })
    },
    {
      path: projectPath("notes/(?<noteId>[0-9A-Z]*)"),
      resolver: ensureProject(({ params, props }) => {
        return import("./pages/note/Note.svelte");
      })
    },
    {
      path: "/credits",
      resolver: () => import("./pages/Credits.svelte")
    },
    { path: ".*", component: NotFound },
  ];
</script>
<Router {routes}/>
