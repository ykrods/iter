<script>
  import { push } from "svelte-spa-history-router";

  import { SLButton, SLIconButton, SLMenu, SLMenuItem } from "$src/ui/shoelace.js";
  import ProjectRepository from "$src/repositories/project-repository.js";

  const available = (typeof window.showDirectoryPicker === 'function');

  let listPromise = list();

  async function open() {
    const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
    const repository = await ProjectRepository.build();
    const project = await repository.put({ id: dirHandle.name, handle: dirHandle });

    push(project.appUrl("index.rst"));

  }

  async function list() {
    const repository = await ProjectRepository.build();
    return repository.list();
  }

  async function clear() {
    const repository = await ProjectRepository.build();
    await repository.clear();
    listPromise = repository.list();
  }
</script>
<svelte:head>
  <title>top | iter</title>
</svelte:head>
<main id="Top">
  {#if available}
    <p class="welcome">Iter</p>

    {#await listPromise }
      <p>...loading</p>
    {:then projects}
      {#if 0 < projects.length}
        <div class="project-list">
          <SLMenu>
            {#each projects as project}
              <SLMenuItem on:click={() => push(project.appUrl("index.rst"))}>{ project.id }</SLMenuItem>
            {/each}
          </SLMenu>
        </div>
      {/if}
    {:catch error}
      <p>Error {error}</p>
    {/await}

    <SLButton variant="primary" on:click={open}>Open Directory</SLButton>
    <SLIconButton name="trash" label="Delete" on:click={clear}></SLIconButton>
  {:else}
    Unsupported browser
  {/if}
</main>
<style>
  main {
    text-align: center;
  }
  .welcome {
    font-size: 2.4em;
  }
  .project-list {
    max-width: 640px;
    margin: 20px auto;
  }
</style>
