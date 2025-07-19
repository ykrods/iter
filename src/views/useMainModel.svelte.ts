import type {
  Project,
  IterIDB,
  IterSyncManager,
  Documents,
  Doc,
} from "$src/types";

import { generateId } from "$src/lib/id";
import createSyncManager from "$src/lib/createSyncManager";
import createDocuments from "$src/lib/doc/createDocuments";


type Opened = {
  project: Project,
  syncManager: IterSyncManager,
  Documents: Documents,
}

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

export default function useMainModel(idb: IterIDB) {
  let _opened = $state<Opened | undefined>();
  let _projects = $state<Project[]>([]);

  return {
    get project() { return _opened?.project },
    get Documents() { return _opened?.Documents },
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

      if (_opened) {
        // TODO: dispose
        // syncManager.dispose();
        // Documents.dispose();
      }
      _opened = {
        project,
        Documents,
        syncManager,
      };
      return _opened;
    },
    async loadProjects() {
      _projects = await idb.projects.getAll()
    },
    addJournal(content: string) {
      const doc: Omit<Doc, "id"> = {
        key: `journals/${generateId()}.rst`,
        title: "",
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      _opened?.Documents.insert(doc)
    }
  }
}
