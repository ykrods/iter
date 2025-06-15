import type {
  Project,
  IterIDB,
  OpenedProject,
} from "$src/types";
import createSyncManager from "$src/lib/syncManager";
import { createDocuments } from "$src/lib/doc/Documents";


async function getGranted(
  handle: FileSystemDirectoryHandle,
): Promise<boolean> {
  const result = await handle.queryPermission({ mode: "readwrite" });
  return result === "granted";
}

async function requestPermission(
  handle: FileSystemDirectoryHandle,
): Promise<boolean> {
  const result = await handle.requestPermission({ mode: "readwrite" });
  return result === "granted";
}

export function useMainModel(idb: IterIDB) {
  let _project = $state<OpenedProject | undefined>()
  let _projects = $state<Project[]>([])

  return {
    get project() { return _project },
    get projects() { return _projects },
    async setup() {
      await this.loadProjects()
    },
    async openRecentProject(project: Project) {
      if (await getGranted(project.handle)) {
        await this.openProject(project)
        return
      }
      if (await requestPermission(project.handle)) {
        await this.openProject(project)
      }
    },
    async openNewProject() {
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      const project: Project = {
        id: handle.name,
        handle,
        openedAt: new Date(),
      };
      await idb.projects.put(project);
      await this.openProject(project);
    },
    async openProject(project: Project) {
      const Documents = createDocuments();
      const syncManager = createSyncManager(project.id, project.handle);

      syncManager.addCollection(Documents, {
        name: "documents",
      });
      syncManager.syncAll()

      _project = Object.assign({
        Documents,
        syncManager,
      }, project)
      /*
    dispose() {
      _syncManager.dispose();
      _Documents.dispose();
    }
      */
      return _project;
    },
    async loadProjects() {
      _projects = await idb.projects.getAll()
    },
  };
}
