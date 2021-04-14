<script>
  import { Checkbox } from "svelte-mui";
  import { push, link } from "svelte-spa-history-router";

  import AddButton from "../ui/buttons/AddButton.svelte";
  import { Issue, ISSUE_STATUSES } from "../models/issue.js";

  import { currentProject, selectedStatuses } from "../stores.js";
  import FormatDate from "../presentation/FormatDate.svelte";

  let project = $currentProject;
  let issuesPromise = Promise.resolve([]);

  $: issuesPromise = Issue.list(project, { statuses: $selectedStatuses }, 20);
</script>

<svelte:head>
  <title>Issues @ { project.id } | iter</title>
</svelte:head>
<main id="Issues" class="card">
  <AddButton on:click={() => { push(project.url("/issues/new")); }} />
  <h1>Issues</h1>

  <fieldset>
    <legend>filters</legend>
    <div class="filter-status-row">
      <div>Status:</div>
      {#each Object.keys(ISSUE_STATUSES) as status }
      <Checkbox bind:group={$selectedStatuses} value={status}>
        <span>{ISSUE_STATUSES[status]}</span>
      </Checkbox>
      {/each}
    </div>
  </fieldset>

  <table>
    <tr>
      <th style="width: 12%">id</th>
      <th style="width: 43%">title</th>
      <th style="width: 15%;" class="prop">status</th>
      <th style="width: 15%;" class="prop">created at</th>
      <th style="width: 15%;" class="prop">updated at</th>
    </tr>
    {#await issuesPromise then issues}
    {#each issues as issue }
    <tr>
      <!-- svelte-ignore a11y-missing-attribute -->
      <td>
        <a use:link href={project.url(`/issues/${issue.id}`)}>{issue.shorten_id}</a>
      </td>
      <!-- svelte-ignore a11y-missing-attribute -->
      <td>
        <a use:link href={project.url(`/issues/${issue.id}`)}>{issue.title}</a>
      </td>
      <td class="prop">{issue.status_disp}</td>
      <td class="prop"><FormatDate value={issue.created_at}/></td>
      <td class="prop"><FormatDate value={issue.updated_at}/></td>
    </tr>
    {/each}
    {/await}
  </table>
</main>

<style>
  .filter-status-row {
    display: flex;
    align-items: center;
  }
</style>
