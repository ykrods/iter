<script lang="ts">
  let { onSave }: {
    onSave: (content: string) => void
  } = $props();

  let content = $state("")

  function save() {
    if (content !== "") {
      onSave(content)
      content = "";
    }
  }
</script>
<div>
  <textarea bind:value={content}></textarea>
  <button onclick={save}>save</button>
</div>
