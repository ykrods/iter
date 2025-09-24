<script lang="ts">
  import {
    SLButton,
    SLDialog,
    SLForm,
    SLInput,
    SLTextarea,
  } from "$src/ui/shoelace";


  let {
    open = $bindable(false),
    keyInput = true,
    onSave,
  } : {
    open: boolean
    keyInput: boolean
    onSave: (key: string, content: string) => Promise<any>
  } = $props();

  const uid = $props.id();
  const formId = `form-${uid}`;

  let key = $state("")
  let content = $state("")

  function onSubmit(evt: SubmitEvent) {
    evt.preventDefault();

    if (content !== "") {
      onSave(key, content);
      reset();
      open = false;
    }
  }

  function reset() {
    key = "";
    content = "";
  }
</script>
<SLDialog bind:open>
  <SLForm id={formId} {onSubmit}>
    {#if keyInput}
      <SLInput label="key" type="text" bind:value={key} required={true}></SLInput>
    {/if}
    <SLTextarea label="content" bind:value={content} resize="auto"></SLTextarea>
  </SLForm>
  <SLButton
    sl-slot="footer"
    type="button"
    onclick={() => open = false}
  >cancel</SLButton>
  <SLButton
    sl-slot="footer"
    type="submit"
    form={formId}
    variant="primary"
  >save</SLButton>
</SLDialog>
