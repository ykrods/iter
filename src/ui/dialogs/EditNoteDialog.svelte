<script>
  import { onMount } from "svelte";
  import { Button, Dialog } from 'svelte-mui';

  import TextArea from '../../mui/TextArea.svelte';
  import { Note } from "../../models/note.js";
  import { currentProject, snackbarMessage } from "../../stores.js";

  export let visible = false;

  export let id = null;
  export let body = "";

  let title = "";

  onMount(() => {
    title = (id === null) ? "New note" : "Edit note";
  });

  $: saveDisabled = (body === "");

  async function onCreateButtonPushed() {
    if (id) {
      const note = await Note.get($currentProject, id);
      note.body = body;
      await note.save($currentProject);
    } else {
      const note = new Note({ body });
      await note.save($currentProject);
      snackbarMessage.info(`Note "${ note.heading }" added`);
    }

    body = "";
    visible = false;
  }
</script>
<Dialog width="500" bind:visible={visible}>
  <div slot="title">{ title }</div>
  <div>
    <TextArea
      bind:value={body}
      name="body"
      required
      rows={Math.min(body.split('\n').length + 3, 30)}
      label="body"
      style="font-family: monospace; font-size: 1em;"
    />
  </div>
  <div slot="actions" class="actions center">
    <Button on:click={() => { visible = false; }}>Cancel</Button>
    <Button
      color="primary"
      disabled={saveDisabled}
      on:click={onCreateButtonPushed}
    >Save</Button>
  </div>
</Dialog>
