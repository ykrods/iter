<script lang="ts">
  import type { Route } from "svelte-spa-history-router";

  import type { Project } from "./types"
  import type Home from "./pages/Home.svelte";
  import type Credits from "./pages/Credits.svelte";
  import type DocView from "./pages/DocView.svelte";
  import type JournalList from "./pages/JournalList.svelte";
  import type Settings from "./pages/Settings.svelte";


  import { Router, redirect } from "svelte-spa-history-router";

  import { getProject } from "$src/lib/project/getProject";

  import Top from "./pages/Top.svelte";
  import NotFound from "./pages/NotFound.svelte";

  type ProjectEnsured = (params: Record<string, string>, props: { project: Project }) => any

  function projectPath(relpath: string) {
    return `/(?<projectId>[0-9a-zA-Z][0-9A-Za-z._\-]*)/${relpath}`;
  }

  function ensureProject(resolver: ProjectEnsured) {
    return async (params: Record<string, string>) => {
      try {
        const project = await getProject(params.projectId);
        const resolved = await Promise.resolve(resolver(params, { project }));

        if ("default" in resolved) {
          return { component: resolved.default, props: { project } };
        } else {
          const { component, props } = resolved;
          return { component, props: Object.assign({ project }, props) };
        }
      } catch (e) {
        return redirect("/");
      }
    }
  }

  const routes: [
    Route<typeof Top>,
    Route<typeof Home>,
    Route<typeof JournalList>,
    Route<typeof DocView>,
    Route<typeof Settings>,
    Route<typeof Credits>,
    Route<typeof NotFound>,
  ] = [
    { path: "/", component: Top },
    {
      path: projectPath(""),
      resolver: ensureProject(() => import("./pages/JournalList.svelte")),
    },
    {
      path: projectPath("journals"), // collections/(.+) ??
      resolver: ensureProject(() => import("./pages/JournalList.svelte")),
    },
    {
      path: projectPath("docs"), // collections/(.+) ??
      resolver: ensureProject(() => import("./pages/FolderView.svelte")),
    },
    {
      path: projectPath("docs/(?<key>[\/0-9A-Z]+\.rst)"),
      resolver: ensureProject(async (params, props) => {
        const component = (await import("./pages/DocView.svelte")).default;
        return {
          component,
          props: { params: { key: params.key } },
        };
      }),
    },
    {
      path: projectPath("settings"),
      resolver: ensureProject(() => import("./pages/Settings.svelte")),
    },
    {
      path: "/credits",
      resolver: () => import("./pages/Credits.svelte")
    },
    { path: ".*", component: NotFound },
  ];
</script>
<Router {routes}/>
