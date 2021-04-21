<script>
  import { createEventDispatcher } from 'svelte';
  import { Textfield, Button, Dialog, Radio } from 'svelte-mui';

  import { ISSUE_STATUSES } from "../../models/issue.js";
  import TextArea from '../../mui/TextArea.svelte';
  import RstViewer from '../RstViewer.svelte';

  const dispatch = createEventDispatcher();

  export let title = '';
  export let body = '';
  export let status = 'OPEN';

  let showPreview = false;

  $: previewEabled = body !== '';
  $: saveEnabled = title !== '';

  async function onSaveButtonPushed() {
    const data = { title, body, status };
    dispatch('save', data);
  }
  async function onCancelButtonPushed() {
    dispatch('cancel');
  }
</script>

<div class="issueForm">
  <Textfield
    name="title"
    autocomplete="off"
    required
    bind:value={title}
    label="title"
    message=""
  />

  {#each Object.keys(ISSUE_STATUSES) as st }
  <Radio bind:group={status} value={st}>{ ISSUE_STATUSES[st] }</Radio>
  {/each}

  <TextArea
    bind:value={body}
    name="body"
    required
    rows={Math.min(body.split('\n').length + 3, 30)}
    label="body"
    style="font-family: monospace; font-size: 1em;"
  />

  <Button on:click="{onCancelButtonPushed}">Cancel</Button>
  <Button disabled={!previewEabled} on:click={() => { showPreview = true }}>Preview</Button>
  <Button disabled={!saveEnabled} color="primary" on:click={onSaveButtonPushed}>Save</Button>

  <Dialog width="500" bind:visible={showPreview}>
    <div slot="title">Preview</div>
    <RstViewer rst={body}/>
  </Dialog>
</div>
