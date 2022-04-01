<script>
  import { setContext } from "svelte";

  import Layout from "../layouts/Layout.svelte";
  import { contextKey } from "../models/project.js";

  export let project;

  setContext(contextKey, {
    getProject: () => project,
  });
</script>
<svelte:head>
  <title>journals @ { project.id } | iter</title>
</svelte:head>
<Layout>
  Journal
</Layout>
<style>
</style>
