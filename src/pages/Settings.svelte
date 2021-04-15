<script>
  import { Button } from "svelte-mui";
  import { push } from "svelte-spa-history-router";

  import { snackbarMessage } from "../stores.js";

  import DeleteConfirmationDialog from "../ui/dialogs/DeleteConfirmationDialog.svelte"
  import ImportFromJsonDialog from "../ui/dialogs/ImportFromJsonDialog.svelte";

  export let project;

  let showDeleteConfirmation = false;
  let showImportFromJsonDialog = false;

  async function onExportAsJsonPushed() {
    const blob = await project.export();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.download = `${project.id}.json`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 30000);
  }

  function onExportAsZipPushed() {
    // TODO
  }

  function onDeletePushed() {
    showDeleteConfirmation = true;
  }
  async function deleteProject() {

    await project.delete();
    snackbarMessage.info(`Delete "${project.id}"`);
    push("/");
  }
</script>

<svelte:head>
  <title>Settings @ { project.id } | iter</title>
</svelte:head>
<main id="Settings" class="card">
  <h1>Settings</h1>
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
    <Button outlined disabled on:click={onExportAsZipPushed}>Export as zip</Button>
  </p>
  <h2>Danger</h2>
  <p>
    <Button
      outlined
      color="var(--danger, red)"
      on:click={onDeletePushed}
    >Delete</Button>
  </p>
</main>
<DeleteConfirmationDialog
  bind:visible={showDeleteConfirmation}
  on:do-delete={deleteProject} />
<ImportFromJsonDialog
  bind:visible={showImportFromJsonDialog}/>
