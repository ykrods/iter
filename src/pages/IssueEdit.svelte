<script>
  import { push } from 'svelte-spa-history-router';

  import IssueForm from "../ui/forms/IssueForm.svelte";
  import { Issue } from "../models/issue.js";

  export let project;

  async function onSave(event) {
    const issue = new Issue(event.detail);
    await issue.save(project);
    push(project.url(`/issues/${issue.id}`));
  }

  function onCancel() {
    push(project.url("/issues"));
  }
</script>

<svelte:head>
  <title>Create issue {project.id} | iter</title>
</svelte:head>
<div id="IssueEdit" class="card">
  <h1 class="heading">New Issue</h1>
  <IssueForm on:save={onSave} on:cancel={onCancel}/>
</div>
