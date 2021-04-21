import { redirect } from "svelte-spa-history-router";

import { Project } from "./models/project.js";
import { Issue as IssueModel } from "./models/issue.js";
import { currentProject } from "./stores.js";

import Top from "./pages/Top.svelte";
import NotFound from "./pages/NotFound.svelte";
import Journal from "./pages/Journal.svelte";
import Issue from "./pages/Issue.svelte";
import IssueEdit from "./pages/IssueEdit.svelte";
import IssueList from "./pages/IssueList.svelte";
import Wiki from "./pages/Wiki.svelte";
import Settings from "./pages/Settings.svelte";

function ensureProject(component) {
  return async (route) => {
    const id = route.params.projectId;

    if (!(await Project.exists(id))) {
      return redirect("/");
    }
    // XXX: currentProject は header や sidebar などで使うので残しているが、
    //      page には props で渡す。そうしないとページ遷移時に 値が変わってバグるため
    //      (画面全体をページで切り替えた方がいいのかも
    const project = new Project(id);
    currentProject.set(project);
    route.props.project = project;
    return component;
  };
}

async function issueResolver(route) {
  // it's a bit complex...
  const p = ensureProject(Issue);
  const result = await p(route);
  if (result !== Issue) {
    return result;
  }
  const issue = await IssueModel.get(route.props.project, route.params.issueId);
  if (!issue) {
    return NotFound;
  }
  route.props.issue = issue;
  return Issue;
}

export default [
  {
    path: "/",
    resolver: async (route) => {
      currentProject.set(null);
      route.props.projects = await Project.list();
      return Top;
    },
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
    path: "/(?<projectId>[0-9a-z-]+)/issues/new",
    resolver: ensureProject(IssueEdit),
  },
  {
    path: "/(?<projectId>[0-9a-z-]+)/issues/(?<issueId>[0-9A-Z]+)",
    resolver: issueResolver,
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
