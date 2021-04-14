<script>
  import { currentProject } from "../stores.js";
  import { Note } from "../models/note.js";

  let projectId = $currentProject.id;
  let listPromise = Note.list($currentProject, 10);
</script>

<svelte:head>
  <title>{ projectId } | iter</title>
</svelte:head>
<main id="Journal">
  <div class="card">
    <h1>Journal</h1>
    <p>warning: 仮置きで Note のリストを出すだけ</p>
  </div>
  {#await listPromise then notes }
    {#each notes as note }
      <div class="card item">
        <pre>{ note.body }</pre>
      </div>
    {/each}
  {/await}
</main>

<style>
.item { margin: 10px 0; }
pre { white-space: pre-wrap ; }
</style>
