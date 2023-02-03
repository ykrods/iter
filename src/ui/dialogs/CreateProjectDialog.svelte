<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";

  import { push } from "svelte-spa-history-router";

  import Dialog from "./Dialog.svelte";

  import { Project } from "../../models/project.js";

  export let open;
  export let id = "";

  $: isValidId = /^[0-9A-Za-z_-]+$/.test(id);

  async function onSubmit() {
    if (!isValidId) {
      return;
    }
    const project = new Project(id);
    await project.save();
    id = "";

    push(project.url("/journals"));
  }
</script>

<Dialog label="Create project" bind:open>
  <sl-input
    name="id"
    type="text"
    value={id}
    class:invalid={ !isValidId }
    on:sl-input={ e => { id = e.target.value }}
    required
    placeholder="Project id"
    help-text="Alphabets, numbers, hyphen (-), and underscore (_) are available."
  ></sl-input>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <sl-button
    slot="footer"
    variant="primary"
    on:click={onSubmit}
    disabled={ !isValidId }
  >Create</sl-button>
</Dialog>
