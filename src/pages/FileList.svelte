<script>
  import { Button } from "svelte-mui";

  import { Upload } from "../models/upload.js";

  import DeleteConfirmationDialog from "../ui/dialogs/DeleteConfirmationDialog.svelte";

  export let project;

  let files;
  let input;
  let deleting;
  let showDeleteConfirmation = false;

  let uploadsPromise = Upload.list(project);

  async function onUploadPushed() {
    for (let file of files) {
      const upload = new Upload(file);
      await upload.save(project);
    }
    input.value = '';
    // reload
    uploadsPromise = Upload.list(project);
  }

  function confirmDelete(upload) {
    deleting = upload;
    showDeleteConfirmation = true;
  }

  async function onDeleteConfirmed() {
    if (deleting) {
      await deleting.delete(project);
      deleting = null;
      uploadsPromise = Upload.list(project);
    }
  }
</script>

<main id="FileList" class="card">
  <h1>Files</h1>
  <input type="file" multiple bind:files bind:this={input} />
  <Button outlined on:click={onUploadPushed}>Upload</Button>
  {#await uploadsPromise then uploads}
    <table>
      <tr>
        <th>name</th>
        <th></th>
      </tr>
      {#each uploads as upload}
        <tr>
          <td><a href={ project.url(`/files/${upload.name}`) }>{ upload.name }</a></td>
          <td><Button icon on:click={ confirmDelete(upload) }>DE</Button></td>
        </tr>
      {/each}
    </table>
  {/await}
</main>
<DeleteConfirmationDialog
  bind:visible={showDeleteConfirmation}
  on:do-delete={onDeleteConfirmed}/>
