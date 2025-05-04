<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    handle,
    onGranted,
    children,
  }: {
    handle: FileSystemDirectoryHandle
    onGranted: () => void
    children: Snippet
  } = $props();

  let grantedPromise = $state(getGranted());

  $effect(() => {
    grantedPromise.then((granted) => {
      if (granted) onGranted()
    })
  });

  async function getGranted(): Promise<boolean> {
    const permission = (await handle.queryPermission({ mode: "readwrite" }));
    return permission === "granted";
  }

  async function requestPermission() {
    await handle.requestPermission({ mode: "readwrite" });
    grantedPromise = getGranted()
  }
</script>
<div>
  {#await grantedPromise then granted}
    {#if granted}
      {@render children()}
    {:else}
      <p>Permission is required to access "{ handle.name }".</p>
      <button onclick={requestPermission}>Grant access</button>
    {/if}
  {/await}
</div>
