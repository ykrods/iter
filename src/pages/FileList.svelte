<script>
  import { Button } from "svelte-mui";

  import { Upload } from "../models/upload.js";

  export let project;

  let files;

  let uploadsPromise = Upload.list(project);

  async function onUploadPushed() {
    for (let file of files) {
      const upload = new Upload(file);
      await upload.save(project);
    }
  }
</script>

<main id="FileList" class="card">
  <h1>Files</h1>
  <div class="uploadArea">
    Drag and Drop
  </div>
  <input type="file" bind:files />
  <Button on:click={onUploadPushed}>Uplaod</Button>
  {#await uploadsPromise then uploads}
    <table>
      <tr>
        <th>name</th>
        <th></th>
      </tr>
      {#each uploads as upload}
        <tr>
          <td>{ upload.name }</td>
          <td>{ upload.blob.type }</td>
        </tr>
      {/each}
    </table>
  {/await}
</main>
