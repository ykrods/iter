<script>
  import { Button, Dialog, Textfield } from 'svelte-mui';
  import { push } from "svelte-spa-history-router";

  import { Project } from "../../models/project.js";

  export let visible = false;
  export let id = "";

  function onCancelButtonPushed() {
    visible = false;
  }

  async function onCreateButtonPushed() {
    const project = new Project(id);
    await project.save();
    push(project.url);
  }
</script>
<Dialog width="500" bind:visible={visible}>
  <div slot="title">Create project</div>
  <p>data is stored to indexedDB</p>
  <div>
    <Textfield
      name="id"
      autocomplete="off"
      required
      bind:value={id}
      label="id"
      message=""
    />
  </div>
  <div slot="actions" class="actions center">
    <Button on:click={onCancelButtonPushed}>Cancel</Button>
    <Button id="add" on:click={onCreateButtonPushed}>Add</Button>
  </div>
</Dialog>
