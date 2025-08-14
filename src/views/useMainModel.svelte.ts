import type {
  AsyncWorkerClient,
  Project,
  IterIDB,
  IterSyncManager,
  Documents as DocumentsType,
  Doc,
  Shelf,
} from "$src/types";

import generateId from "$src/lib/generateId";
import rewriteHTML from "$src/lib/rewriteHTML";
import createSyncManager from "$src/lib/createSyncManager";
import createDocuments from "$src/lib/doc/createDocuments";

// FIXME: | { name: "doc", doc: Doc }
type Routes = { name: string, doc?: Doc }

type Opened = {
  project: Project,
  syncManager: IterSyncManager,
  Documents: DocumentsType,
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

export default function useMainModel(idb: IterIDB, client: AsyncWorkerClient) {
  let _opened = $state<Opened | undefined>();
  let _projects = $state<Project[]>([]);
  let _route: Routes = $state({ name: "docs" });

  return {
    get project() { return _opened?.project },
    get Documents() { return _opened?.Documents },
    get projects() { return _projects },
    get route() { return _route },
    get routeShelf() {
      if (!_route || !_opened)
        return undefined;

      return _opened.project.shelves.find(o => o.name === _route.name);
    },
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
        shelves: [
          { name: "docs", type: "folder" },
          { name: "journals", type: "note" },
          { name: "decisions", type: "serial" },
        ],
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
    show(route: Routes) {
      _route = route;
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
    },
    async rst2html(content: string, key: string) {
      if (!_opened) {
        return ""
      }
      const h = await client.rst2html(content)
      return rewriteHTML(h, {
        origin: window.origin,
        project: _opened.project.id,
        key,
      });
    },
    getCursor() {
      const shelf = this.routeShelf;
      if (!shelf || !_opened) throw new Error("unexpected");

      return _opened.Documents.find({
        key: new RegExp(`^${shelf.name}/`)
      });
    },
    openDoc(path: string) {
      if (!_opened) {
        return;
      }
      const key = path.substring(_opened.project.id.length + 2);
      const doc = _opened.Documents.findOne({ key });
      if (doc) {
        this.show({ name: "doc",  doc })
      }
    },
    dispose() {
      // TODO
      // syncManager.dispose();
      // Documents.dispose();

      console.log("dispose");
      client.close();
    }
  }
}
