import { redirect } from "svelte-spa-history-router";

import { Project } from "./models/project.js";
import { currentProject } from "./stores.js";

import Top from "./pages/Top.svelte";
import NotFound from "./pages/NotFound.svelte";
import Journal from "./pages/Journal.svelte";
import IssueList from "./pages/IssueList.svelte";
import Wiki from "./pages/Wiki.svelte";
import Settings from "./pages/Settings.svelte";


function ensureProject(component) {
  return async (route) => {
    const id = route.params.projectId;

    if (!await Project.exists(id)) {
      return redirect("/");
    }
    // XXX: currentProject は header や sidebar などで使うので残しているが、
    //      page には props で渡す。そうしないとページ遷移時に 値が変わってバグるため
    //      (画面全体をページで切り替えた方がいいのかも
    const project = new Project(id);;
    currentProject.set(project);
    route.props.project = project;
    return component;
  };
}

export default [
  {
    path: "/",
    resolver: async (route) => {
      currentProject.set(null);
      route.props.projects = await Project.list();
      return Top;
    }
  },
  {
    path: "/(?<projectId>[0-9a-z-]+)",
    resolver: ensureProject(Journal),
  },
  {
    path: "/(?<projectId>[0-9a-z-]+)/issues",
    resolver: ensureProject(IssueList),
  },
  {
    path: "/(?<projectId>[0-9a-z-]+)/wiki",
    resolver: ensureProject(Wiki),
  },
  {
    path: "/(?<projectId>[0-9a-z-]+)/settings",
    resolver: ensureProject(Settings),
  },
  { path: ".*", component: NotFound },
];
