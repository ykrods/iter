<script>
  import { Button } from "svelte-mui";
  import { push } from "svelte-spa-history-router";

  import { currentProject, snackbarMessage } from "../stores.js";

  import DeleteConfirmationDialog from "../ui/dialogs/DeleteConfirmationDialog.svelte"

  let projectId = $currentProject.id;
  let showDeleteConfirmation = false;

  async function onExportAsJsonPushed() {
    const blob = await $currentProject.export();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.download = `${projectId}.json`;
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

    await $currentProject.delete();
    snackbarMessage.info(`Delete "${projectId}"`);
    push("/");
  }
</script>

<svelte:head>
  <title>Settings @ { projectId } | iter</title>
</svelte:head>
<main id="Settings" class="card">
  <h1>Settings</h1>
  <p>
    <Button outlined on:click={onExportAsJsonPushed}>Export as json</Button>
  </p>
  <p>
    <Button outlined disabled on:click={onExportAsZipPushed}>Export as zip</Button>
  </p>
  <p>
    <Button outlined style="color: var(--danger);" on:click={onDeletePushed}>Delete</Button>
  </p>
</main>
<DeleteConfirmationDialog
  bind:visible={showDeleteConfirmation}
  on:do-delete={deleteProject} />
