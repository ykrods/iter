<script>
  import { liveQuery } from "dexie";
  import { setContext } from "svelte";
  import { link, push } from "svelte-spa-history-router";

  import { contextKey } from "../models/project.js";

  import Layout from "../layouts/Layout.svelte";
  import FormatDateTime from "../presentations/FormatDateTime.svelte";
  import RstViewer from "../ui/RstViewer.svelte";

  export let project;
  export let journal;

  setContext(contextKey, {
    getProject: () => project,
  });

</script>

<svelte:head>
  <title>{ journal.heading } @ { project.id } | iter</title>
</svelte:head>
<Layout>
  <a use:link href={ project.url("/journals") }>journals</a> / { journal.id }
  <RstViewer rst={journal.body}/>
</Layout>
