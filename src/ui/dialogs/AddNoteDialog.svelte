<script>
  import { ulid } from 'ulid';
  import { Button, Dialog } from 'svelte-mui';

  import TextArea from '../../mui/TextArea.svelte';
  import { Note } from "../../models/note.js";
  import { currentProject } from "../../stores.js";

  export let visible = false;
  export let body = "";

  function onCancelButtonPushed() {
    visible = false;
  }

  async function onCreateButtonPushed() {
    const note = new Note({ body });
    await note.save($currentProject);

    body = "";
    visible = false;
  }
</script>
<Dialog width="500" bind:visible={visible}>
  <div slot="title">Add new note</div>
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
    <Button on:click={onCancelButtonPushed}>Cancel</Button>
    <Button on:click={onCreateButtonPushed}>Add</Button>
  </div>
</Dialog>
