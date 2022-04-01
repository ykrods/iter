<script>
  import { getContext } from "svelte";
  import { link } from "svelte-spa-history-router";

  import { contextKey } from "../models/project.js";

  const { getProject } = getContext(contextKey);

  const project = getProject();
</script>
<div class="sidebarContent">
  <ul>
    <li><a use:link href={project.url("/journals")}>Journals</a></li>
    <li><a use:link href={project.url("/decisions")}>Decisions</a></li>
  </ul>
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
