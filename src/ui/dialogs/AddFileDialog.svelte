<script>
  import { createEventDispatcher } from 'svelte';
  import { Button, Dialog } from 'svelte-mui';

  import { currentProject } from "../../stores.js";
  import { Upload } from "../../models/upload.js";

  const dispatch = createEventDispatcher();

  export let visible = false;

  let files;
  let input;

  $: uploadDisabled = !files || files.length === 0;

  async function onUploadPushed() {
    for (let file of files) {
      const upload = new Upload(file);
      await upload.save($currentProject);
    }
    input.value = '';
    visible = false;
    dispatch('save');
  }
</script>

<Dialog bind:visible>
  <div slot="title">Upload File</div>
  <div>
    <input type="file" multiple bind:files bind:this={input} />
  </div>
  <div slot="actions" class="actions center">
    <Button on:click={() => { visible = false }}>Cancel</Button>
    <Button disabled={uploadDisabled} color="primary" on:click={onUploadPushed}>Upload</Button>
  </div>
</Dialog>
