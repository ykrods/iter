<script>
  import { onMount } from "svelte";

  import "@shoelace-style/shoelace/dist/components/button/button";
  import "@shoelace-style/shoelace/dist/components/dialog/dialog";
  import "@shoelace-style/shoelace/dist/components/input/input";
  import { push } from "svelte-spa-history-router";

  import { Project } from "../models/project.js";

  export let visible;
  export let id = "";

  let dialog;

  $: isValidId = /^[0-9A-Za-z_-]+$/.test(id);

  onMount(() => {
    const afterHide = () => { visible = false; };
    dialog.addEventListener('sl-after-hide', afterHide);

    return () => {
      dialog.removeEventListener('sl-after-hide', afterHide);
    }
  });

  $: if (visible) { dialog.show(); }

  async function onSubmit() {
    if (!isValidId) {
      return;
    }
    const project = new Project(id);
    await project.save();
    id = "";
    // dialog.hide();
    push(project.url("/journals"));
  }
</script>

<sl-dialog label="Create project" bind:this={dialog}>
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
  <sl-button
    slot="footer"
    variant="primary"
    on:click={onSubmit}
    disabled={ !isValidId }
  >Create</sl-button>
</sl-dialog>
<style>
  .invalid:not([disabled])::part(label),
  .invalid:not([disabled])::part(help-text) {
    color: var(--sl-color-danger-600);
  }
  .invalid:not([disabled])::part(base) {
    border-color: var(--sl-color-danger-600);
  }
  .invalid:focus-within::part(base) {
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-danger-600);
  }
</style>
