<script>
  import { getContext } from "svelte";
  import { link } from "svelte-spa-history-router";

  import { contextKey } from "../models/project.js";
  import CreateJournalDialog from "../ui/dialogs/CreateJournalDialog.svelte";

  const { getProject } = getContext(contextKey);

  let showCreateJournalDialog = false;

  const project = getProject();
</script>
<div class="sidebarContent">
  <ul>
    <li>
      <a use:link href={project.url("/journals")}>Journals</a>
      <sl-icon-button
        name="plus-square"
        label="Create Journal"
        on:click={() => { showCreateJournalDialog = true }}
      />
    </li>
    <li>
      <a use:link href={project.url("/decisions")}>Decisions</a>
    </li>
  </ul>
  <CreateJournalDialog bind:open={showCreateJournalDialog}/>
</div>
<style>
  ul {
    padding: 0;
    list-style: none;
  }
  .sidebarContent {
    margin: 5rem 1rem 1rem 2rem;
  }
</style>
