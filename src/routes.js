import { Project } from "./models/project.js";
import { currentProject, projects } from "./stores.js";

import Top from "./pages/Top.svelte";
import NotFound from "./pages/NotFound.svelte";
import Journal from "./pages/Journal.svelte";
import Issues from "./pages/Issues.svelte";
import Wiki from "./pages/Wiki.svelte";
import Settings from "./pages/Settings.svelte";

function topGuard(from, to, next) {
  currentProject.set(null);
  projects.reload().then(next);
}

function projectGuard(from, to, next) {
  const id = to.params.projectId;

  Project.exists(id).then((exists) => {
    if (exists) {
      currentProject.set(new Project(id));
      next();
    } else {
      next("/");
    }
  });
}

function projectRoutes(childRoutes) {
  return childRoutes.map((route) => {
    return {
      path: "/(?<projectId>[0-9a-z-]+)" + route.path,
      component: route.component,
      guard: projectGuard,
    };
  });
}

export default [{ path: "/", component: Top, guard: topGuard }].concat(
  projectRoutes([
    { path: "", component: Journal },
    { path: "/issues", component: Issues },
    { path: "/wiki", component: Wiki },
    { path: "/settings", component: Settings },
  ]),
  {
    path: ".*",
    component: NotFound,
  }
);
