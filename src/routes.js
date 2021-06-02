import { redirect } from "svelte-spa-history-router";

import { Project } from "./models/project.js";
import { Issue } from "./models/issue.js";
import { WikiPage } from "./models/wiki_page.js";
import { Note } from "./models/note.js";

import { currentProject } from "./stores.js";

import NotFound from "./pages/NotFound.svelte";

function ensureProject({ component, resolver }) {
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

    if (component) {
      return component;
    }
    if (resolver) {
      return await resolver(route);
    }
    throw new Error("Wrong Arguments");
  };
}

async function noteResolver(route) {
  const note = await Note.get(route.props.project, route.params.noteId);
  if (!note) {
    return NotFound;
  }
  route.props.note = note;
  return import("./pages/NoteView.svelte");
}

async function issueResolver(route) {
  const issue = await Issue.get(route.props.project, route.params.issueId);
  if (!issue) {
    return NotFound;
  }
  route.props.issue = issue;
  return import("./pages/IssueView.svelte");

}

async function wikiResolver(route) {
  const path = route.params.path || 'Home';
  const wikiPage = await WikiPage.get(route.props.project, path);
  route.props.wikiPage = wikiPage || new WikiPage({ path, body: "" });
  return import("./pages/Wiki.svelte");
}

export default [
  {
    path: "/",
    resolver: async (route) => {
      currentProject.set(null);
      route.props.projects = await Project.list();
      return import("./pages/Top.svelte");
    },
  },
  {
    path: "/credits",
    resolver: () => {
      currentProject.set(null);
      return import("./pages/Credits.svelte");
    }
  },
  {
    path: "/(?<projectId>[0-9a-zA-Z_-]+)/issues",
    resolver: ensureProject({ component: import("./pages/IssueList.svelte") }),
  },
  {
    path: "/(?<projectId>[0-9a-zA-Z_-]+)/issues/new",
    resolver: ensureProject({ component: import("./pages/IssueEdit.svelte") }),
  },
  {
    path: "/(?<projectId>[0-9a-zA-Z_-]+)/issues/(?<issueId>[0-9]+)",
    resolver: ensureProject({ resolver: issueResolver }),
  },
  {
    path: "/(?<projectId>[0-9a-zA-Z_-]+)/wiki/(?<path>.*)",
    resolver: ensureProject({ resolver: wikiResolver }),
  },
  {
    path: "/(?<projectId>[0-9a-zA-Z_-]+)/notes",
    resolver: ensureProject({ component: import("./pages/NoteList.svelte") }),
  },
  {
    path: "/(?<projectId>[0-9a-zA-Z_-]+)/notes/(?<noteId>[0-9A-Z]+)",
    resolver: ensureProject({ resolver: noteResolver }),
  },
  {
    path: "/(?<projectId>[0-9a-zA-Z_-]+)/files",
    resolver: ensureProject({ component: import("./pages/FileList.svelte") }),
  },
  {
    path: "/(?<projectId>[0-9a-zA-Z_-]+)/settings",
    resolver: ensureProject({ component: import("./pages/Settings.svelte") }),
  },
  { path: ".*", component: NotFound },
];
