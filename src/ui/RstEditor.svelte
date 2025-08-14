<script lang="ts">
  import type { Shelf } from "$src/types";

  import DocViewer from "$src/ui/DocViewer.svelte";

  let {
    preview,
    rst2html,
    shelf,
    content = $bindable(""),
  }: {
    preview: boolean
    rst2html: (content: string, key: string) => Promise<string>
    shelf: Shelf
    content: string
  } = $props();

  let textarea = $state<HTMLTextAreaElement>();
  let innerHeight = $state(window.innerHeight);
  let html = $state("");

  let contentRows = $derived.by(() => {
    if (!textarea) {
      return 3;
    }
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
    const maxHeight = innerHeight - ((shelf.type === "folder") ? 400 : 300);
    const rows = Math.floor(maxHeight / lineHeight);
    if (rows < 3) {
      return 3;
    }
    return Math.min(rows, content.split("\n").length);
  });

  $effect(() => {
    rst2html(content, `${shelf.name}/tmp`).then(h => html = h);
  });
</script>
<div>
  {#if preview}
    <DocViewer {html} onNavigate={() => undefined}/>
  {:else}
    <fieldset class="fieldset">
      <legend class="fieldset-legend">content</legend>
      <textarea
        rows={contentRows}
        bind:this={textarea}
        bind:value={content}
        required
        class="textarea w-full font-mono"
      ></textarea>
    </fieldset>
  {/if}
</div>
<svelte:window bind:innerHeight />
