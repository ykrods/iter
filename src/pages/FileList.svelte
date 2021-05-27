<script>
  import { Button } from "svelte-mui";
  import TrashAlt from "@fortawesome/fontawesome-free/svgs/regular/trash-alt.svg";

  import { Upload } from "../models/upload.js";

  import AddButton from "../ui/buttons/AddButton.svelte";
  import DeleteConfirmationDialog from "../ui/dialogs/DeleteConfirmationDialog.svelte";
  import AddFileDialog from "../ui/dialogs/AddFileDialog.svelte";

  export let project;

  let deleting;
  let showAddFileDialog = false;
  let showDeleteConfirmation = false;

  let uploadsPromise = Upload.list(project);

  function confirmDelete(upload) {
    deleting = upload;
    showDeleteConfirmation = true;
  }

  async function onDeleteConfirmed() {
    if (deleting) {
      await deleting.delete(project);
      deleting = null;
      reload();
    }
  }

  function reload() {
    uploadsPromise = Upload.list(project);
  }
</script>

<main id="FileList" class="card">
  <div class="heading--flex">
    <h1>Files</h1>
    <AddButton on:click={() => { showAddFileDialog = true; }} />
  </div>
  <div class="list">
  {#await uploadsPromise then uploads}
    {#if uploads.length === 0}
      <div>No files</div>
    {/if}
    {#each uploads as upload}
      <div class="row">
        <a href={ project.url(`/files/${upload.name}`) }>{ upload.name }</a>
        <Button dense icon on:click={ confirmDelete(upload) }>
          <svelte:component this={TrashAlt}/>
        </Button>
      </div>
    {/each}
  {/await}
  </div>
</main>
<AddFileDialog
  bind:visible={showAddFileDialog}
  on:save={reload}
/>
<DeleteConfirmationDialog
  bind:visible={showDeleteConfirmation}
  on:deleteConfirmed={onDeleteConfirmed}/>
<style>
  .list {
    border-top: 1px solid #ddd;
  }
  .row {
    display:flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #ddd;
  }
</style>
