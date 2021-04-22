<script>
  import { createEventDispatcher } from 'svelte';
  import { Button, Textfield, Dialog } from 'svelte-mui';

  import TextArea from '../../mui/TextArea.svelte';
  import RstViewer from '../RstViewer.svelte';

  const dispatch = createEventDispatcher();

  export let path = '';
  export let body = '';

  let showPreview = false;

  $: saveEnabled = path !== '' && body !== '';
  $: previewEnabled = body !== '';

  async function onSaveButtonPushed() {
    dispatch('save', { path, body });
  }
</script>
<div class="form">
  <Textfield
    name="path"
    autocomplete="off"
    required
    bind:value={path}
    label="path"
    message=""
  />

  <TextArea
    bind:value={body}
    name="body"
    required
    rows={Math.min(body.split('\n').length + 3, 50)}
    label="body"
    style="font-family: monospace; font-size: 1em;"
  />

  <Button on:click="{() => { dispatch("cancel"); }}">Cancel</Button>
  <Button disabled={!previewEnabled} on:click={() => { showPreview = true }}>Preview</Button>
  <Button disabled={!saveEnabled} color="primary" on:click={onSaveButtonPushed}>Save</Button>

  <Dialog width="500" bind:visible={showPreview}>
    <div slot="title">Preview</div>
    <RstViewer rst={body}/>
  </Dialog>
</div>
