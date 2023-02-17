<script>
  import { getContext } from "svelte";
  import { link } from "svelte-spa-history-router";

  import { contextKey } from "../models/project.js";
  import CreateJournalDialog from "../ui/dialogs/CreateJournalDialog.svelte";
  import Footer from "./Footer.svelte";

  const { getProject } = getContext(contextKey);

  let showCreateJournalDialog = false;

  const project = getProject();
</script>
<div class="sidebarContent">
  <ul>
    <li>
      <a use:link href={project.url("/journals")}>Journals</a>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
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
  <div class="footerContainer">
    <Footer/>
  </div>
</div>
<CreateJournalDialog bind:open={showCreateJournalDialog}/>

<style>
  .sidebarContent {
    margin-right: 1rem;
    margin-left: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
  }
  .sidebarContent > ul {
    margin-top: 4rem;
    padding: 0;
    list-style: none;
  }
  .sidebarContent > .footerContainer {
    margin-bottom: 0.5rem;
  }
</style>
