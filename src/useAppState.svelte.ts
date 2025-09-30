import type {
  AppState,
  Project,
  Workspace,
  WorkspaceState,
  IterIDB,
  Shelf,
  AsyncWorkerClient,
} from "$src/types";

import createSyncManager from "$src/lib/createSyncManager";
import createDocuments from "$src/lib/doc/createDocuments";
import useWorkspaceState from "$src/useWorkspaceState.svelte";


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

function createWorkspace(project: Project): Workspace {
  const Documents = createDocuments();
  const syncManager = createSyncManager(project.id, project.handle);
  syncManager.addCollection(Documents, {
    name: "documents",
  });
  syncManager.syncAll()

  const shelves: Shelf[] = [
    { type: "folder", name: "docs" },
    { type: "note", name: "journals" },
    { type: "serial", name: "decisions" },
  ];

  return { project, syncManager, Documents, shelves }
}


export default function useAppState(
  idb: IterIDB,
  client: AsyncWorkerClient,
): AppState {
  let _selected = $state<Project | undefined>()
  let _workspace = $state<Workspace | undefined>()
  let _workspaceState = $state<WorkspaceState>()

  const appState = {
    get selected() { return _selected },
    get workspace() { return _workspace },
    get workspaceState() { return _workspaceState },
    async openProject(name: string): Promise<Workspace | undefined> {
      const project = await idb.projects.get(name);
      if (!project) {
        throw new Error("project not found");
      }
      _selected = project;
      if (_workspace && _workspace.project.id === _selected.id) {
        return _workspace;
      }
      const granted = await getGranted(project.handle);
      this.updateWorkspace(granted);
      return _workspace;
    },
    async requestAccessPermission() {
      const granted = await requestPermission(_selected!.handle)
      this.updateWorkspace(granted)
      return _workspace;
    },
    updateWorkspace(granted: boolean) {
      if (_workspace) {
        _workspace.syncManager.dispose()
        _workspace.Documents.dispose()
      }
      if (granted) {
        _workspace = createWorkspace(_selected!)
        _workspaceState = useWorkspaceState(_workspace, client);
      } else {
        _workspace = undefined
      }
    }
  }
  return appState
}
