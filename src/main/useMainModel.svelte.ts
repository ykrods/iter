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

export function useMainModel(idb: IterIDB) {
  let _project = $state<Project | undefined>(undefined)
  let _projects = $state<Project[]>([])
  let _syncManager: SyncManager<Record<string, any>, { id: string; }> | undefined
  let _Documents = $state(createDocuments())

  return {
    get project() { return _project },
    get projects() { return _projects },
    get Documents() { return _Documents },
    async setup() {
      await this.loadProjects()
    },
    async openRecentProject(project: Project) {
      if (await getGranted(project.handle)) {
        this.setProject(project)
        return
      }
      if (await requestPermission(project.handle)) {
        this.setProject(project)
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
      this.setProject(project)
    },
    async setProject(project: Project) {
      _project = project;
      await this.sync()
    },
    async sync() {
      console.log("sync")
      _Documents = createDocuments()
      _syncManager = createSyncManager(_project!.id, _project!.handle);
      _syncManager.addCollection(_Documents, {
        name: "documents",
      });
      _syncManager.syncAll()
    },
    async loadProjects() {
      _projects = await idb.projects.getAll()
    },
  };
}
