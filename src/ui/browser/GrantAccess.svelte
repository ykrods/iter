<script>
  import { SLButton } from "$src/ui/shoelace.js";

  export let project;

  let grantedPromise = getGranted();
  let granted = false;

  async function getGranted() {
    granted = (await project.handle.queryPermission({ mode: "readwrite" })) === "granted";
    return granted;
  }

  async function requestPermission() {
    await project.handle.requestPermission({ mode: "readwrite" });
    grantedPromise = getGranted()
  }
</script>
<div>
  {#await grantedPromise then granted}
    {#if granted}
      <slot></slot>
    {:else}
      <p>Permission is required to access "{ project.id }".</p>
      <SLButton on:click={requestPermission}>Grant access</SLButton>
    {/if}
  {/await}
</div>
