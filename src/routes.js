import { redirect } from "svelte-spa-history-router";

import { Project } from "./models/project.js";
import { Issue } from "./models/issue.js";
import { WikiPage } from "./models/wiki_page.js";
import { Note } from "./models/note.js";

import { currentProject } from "./stores.js";

import Top from "./pages/Top.svelte";
import NotFound from "./pages/NotFound.svelte";
import IssueView from "./pages/IssueView.svelte";
import IssueEdit from "./pages/IssueEdit.svelte";
import IssueList from "./pages/IssueList.svelte";
import Wiki from "./pages/Wiki.svelte";
import NoteList from "./pages/NoteList.svelte";
import NoteView from "./pages/NoteView.svelte";
import FileList from "./pages/FileList.svelte";
import Settings from "./pages/Settings.svelte";

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
  return NoteView;
}

async function issueResolver(route) {
  const issue = await Issue.get(route.props.project, route.params.issueId);
  if (!issue) {
    return NotFound;
  }
  route.props.issue = issue;
  return IssueView;
}

async function wikiResolver(route) {
  const path = route.params.path || 'Home';
  const wikiPage = await WikiPage.get(route.props.project, path);
  route.props.wikiPage = wikiPage || new WikiPage({ path, body: "" });
  return Wiki;
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
    path: "/(?<projectId>[0-9a-z-]+)/issues",
    resolver: ensureProject({ component: IssueList }),
  },
  {
    path: "/(?<projectId>[0-9a-z-]+)/issues/new",
    resolver: ensureProject({ component: IssueEdit }),
  },
  {
    path: "/(?<projectId>[0-9a-z-]+)/issues/(?<issueId>[0-9]+)",
    resolver: ensureProject({ resolver: issueResolver }),
  },
  {
    path: "/(?<projectId>[0-9a-z-]+)/wiki/(?<path>.*)",
    resolver: ensureProject({ resolver: wikiResolver }),
  },
  {
    path: "/(?<projectId>[0-9a-z-]+)/notes",
    resolver: ensureProject({ component: NoteList }),
  },
  {
    path: "/(?<projectId>[0-9a-z-]+)/notes/(?<noteId>[0-9A-Z]+)",
    resolver: ensureProject({ resolver: noteResolver }),
  },
  {
    path: "/(?<projectId>[0-9a-z-]+)/files",
    resolver: ensureProject({ component: FileList }),
  },
  {
    path: "/(?<projectId>[0-9a-z-]+)/settings",
    resolver: ensureProject({ component: Settings }),
  },
  { path: ".*", component: NotFound },
];
