<script>
  import { onMount } from "svelte";

  import "@shoelace-style/shoelace/dist/components/button/button";
  import "@shoelace-style/shoelace/dist/components/dialog/dialog";
  import "@shoelace-style/shoelace/dist/components/input/input";

  export let visible;
  export let id = "";

  let dialog;
  let input;

  $: validId = /^[0-9A-Za-z_-]+$/.test(id);

  $: console.log(id);

  onMount(() => {
    const afterHide = () => { visible = false; };
    dialog.addEventListener('sl-after-hide', afterHide);

    return () => {
      dialog.removeEventListener('sl-after-hide', afterHide);
    }

  });

  $: if (visible) { dialog.show(); }
</script>

<sl-dialog label="Create project" bind:this={dialog}>
  <sl-input
    bind:this={input}
    on:sl-change={ (evt) => { console.log(evt); id = evt.value; }}
    placeholder="Project id"
  ></sl-input>
  <sl-button
    slot="footer"
    variant="primary"
    on:click={ () => dialog.hide() }
    disabled={ !validId }
  >Add</sl-button>
</sl-dialog>
