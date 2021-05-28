<script>
  import { Button } from "svelte-mui";
  import { push } from "svelte-spa-history-router";
  import * as zip from "@zip.js/zip.js";

  import { Issue } from "../models/issue.js";
  import { WikiPage } from "../models/wiki_page.js";
  import { Note } from "../models/note.js";
  import { Upload } from "../models/upload.js";

  import { snackbarMessage } from "../stores.js";

  import DeleteConfirmationDialog from "../ui/dialogs/DeleteConfirmationDialog.svelte"
  import ImportFromJsonDialog from "../ui/dialogs/ImportFromJsonDialog.svelte";

  export let project;

  let showDeleteConfirmation = false;
  let showImportFromJsonDialog = false;

  async function onExportAsJsonPushed() {
    const blob = await project.export();
    download(`${project.id}.json`, blob);
  }

  async function onExportAsZipPushed() {
    const blob = await exportAsZip();
    download(`${project.id}.zip`, blob);
  }

  function download(name, blob) {
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.download = name;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => { URL.revokeObjectURL(url); }, 30000);
  }

  async function onDeleteConfirmed() {
    await project.delete();
    snackbarMessage.info(`Delete "${project.id}"`);
    push("/");
  }

  async function exportAsZip() {
    zip.configure({ useWebWorkers: false });
    const blobWriter = new zip.BlobWriter("application/zip");
    const writer = new zip.ZipWriter(blobWriter);

    // issues
    for (const issue of await Issue.list(project)) {
      await writer.add(
        `issues/${issue.id}.rst`,
        new zip.TextReader(issue.toRst()),
      );
    }
    // wiki
    for (const wikiPage of await WikiPage.list(project)) {
      await writer.add(`wiki/${wikiPage.path}.rst`, new zip.TextReader(wikiPage.body));
    }
    // note
    for (const note of await Note.list(project)) {
      await writer.add(`notes/${note.id}.rst`, new zip.TextReader(note.body));
    }
    // files
    for (const upload of await Upload.list(project)) {
      await writer.add(`files/${upload.name}`, new zip.BlobReader(upload.blob));
    }
    await writer.close();

    return blobWriter.getData();
  }
</script>

<svelte:head>
  <title>Settings @ { project.id } | iter</title>
</svelte:head>
<main id="Settings" class="card">
  <h1 class="heading">Settings</h1>
  <h2>Import</h2>
  <p>
    <Button
      outlined
      on:click={() => { showImportFromJsonDialog = true; }}
    >Import from json</Button>
  </p>
  <h2>Export</h2>
  <p>
    <Button outlined on:click={onExportAsJsonPushed}>Export as json</Button>
  </p>
  <p>
    <Button outlined on:click={onExportAsZipPushed}>Export as zip</Button>
  </p>

  <h2>Danger</h2>
  <p>
    <Button
      outlined
      color="var(--danger, red)"
      on:click={() => { showDeleteConfirmation = true; }}
    >Delete</Button>
  </p>
</main>
<DeleteConfirmationDialog
  bind:visible={showDeleteConfirmation}
  on:deleteConfirmed={onDeleteConfirmed} />
<ImportFromJsonDialog
  bind:visible={showImportFromJsonDialog}/>
