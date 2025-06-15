import type { Project, IterIDB } from "$src/types"
import createSyncManager from "$src/lib/syncManager";
import { createDocuments } from "$src/lib/doc/Documents";
import type { SyncManager } from "@signaldb/sync";


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


export function useMainProjectModel(project: Project) {
  let _project = $state(project);
  let _Documents = $state(createDocuments());
  let _syncManager: SyncManager<Record<string, any>, { id: string; }> | undefined

  _syncManager = createSyncManager(_project!.id, _project!.handle);
  _syncManager.addCollection(_Documents, {
    name: "documents",
  });
  _syncManager.syncAll()

  return {
    get project() { return _project },
    get Documents() { return _Documents },
    dispose() {
      _syncManager.dispose();
      _Document.dispose();
    }
  }
}


export function useMainModel(idb: IterIDB) {
  let _projectModel = $state(undefined)
  let _projects = $state<Project[]>([])

  return {
    get project() { return _projectModel?.project },
    get projects() { return _projects },
    get Documents() { return _projectModel?.Documents },
    async setup() {
      await this.loadProjects()
    },
    async openRecentProject(project: Project) {
      if (await getGranted(project.handle)) {
        this.setProjectModel(project)
        return
      }
      if (await requestPermission(project.handle)) {
        this.setProjectModel(project)
      }
    },
    async openProject() {
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      const project: Project = {
        id: handle.name,
        handle,
        openedAt: new Date(),
      };
      await idb.projects.put(project);
      this.setProjectModel(project)
    },
    async setProjectModel(project: Project) {
      _projectModel = useMainProjectModel(project);
    },
    async loadProjects() {
      _projects = await idb.projects.getAll()
    },
  };
}
