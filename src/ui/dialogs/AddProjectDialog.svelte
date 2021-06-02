<script>
  import { Button, Dialog, Textfield } from 'svelte-mui';
  import { push } from "svelte-spa-history-router";

  import { Project } from "../../models/project.js";

  export let visible = false;
  export let id = "";

  $: validId = /^[0-9A-Za-z_-]+$/.test(id);

  function onCancelButtonPushed() {
    visible = false;
  }

  async function onCreateButtonPushed() {
    const project = new Project(id);
    await project.save();
    push(project.url("/issues"));
  }
</script>
<Dialog width="500" bind:visible={visible}>
  <div slot="title">Create project</div>
  <div>
    <Textfield
      name="id"
      autocomplete="off"
      required
      bind:value={id}
      label="id"
      message="Accept only alphabets, numbers, - or _ is available"
      error={ (id === "" || validId) ? "" : "Invalid Character(s)" }
    />
  </div>
  <div slot="actions" class="actions center">
    <Button on:click={onCancelButtonPushed}>Cancel</Button>
    <Button
      disabled={ !validId }
      id="add"
      color="primary"
      on:click={onCreateButtonPushed}
    >Add</Button>
  </div>
</Dialog>
