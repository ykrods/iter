<script>
  import { ulid } from 'ulid';
  import { onMount } from "svelte";
  import { Button, Dialog } from 'svelte-mui';

  import TextArea from '../../mui/TextArea.svelte';
  import { Note } from "../../models/note.js";
  import { currentProject } from "../../stores.js";

  export let visible = false;

  export let note = null;
  export let body = "";

  let title = "";
  onMount(() => {
    title = (note === null) ? "Add new note" : "Edit note";
  });

  async function onCreateButtonPushed() {
    if (note) {
      note.body = body;
    } else {
      note = new Note({ body });
    }
    await note.save($currentProject);

    body = "";
    visible = false;
    note = null;
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
    <Button on:click={onCreateButtonPushed}>Add</Button>
  </div>
</Dialog>
