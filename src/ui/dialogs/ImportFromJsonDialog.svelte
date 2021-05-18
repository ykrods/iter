<script>
  import { Button, Dialog } from 'svelte-mui';

  import { currentProject, snackbarMessage } from "../../stores.js";

  export let visible = false;
  let files;

  async function onCreateButtonPushed() {
    try {
      await $currentProject.import(files[0]);
      snackbarMessage.info("success to import");
      visible = false;
    } catch (e) {
      snackbarMessage.error(e);
    }
  }

</script>
<Dialog width="500" bind:visible={visible}>
  <div slot="title">Import from json</div>
  <div>
    <input type="file" accept="json" bind:files />
  </div>
  <div slot="actions" class="actions center">
    <Button on:click={() => { visible = false; }}>Cancel</Button>
    <Button disabled={!files} on:click={onCreateButtonPushed}>Import</Button>
  </div>
</Dialog>
