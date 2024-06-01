<script lang="ts">
  import type { Project } from "$src/types";

  import { SLButton, SLDialog, SLForm, SLInput } from "$src/ui/shoelace";
  import { createProject } from "$src/lib/project/createProject";


  let {
    open = $bindable(false),
    onCreate,
  }: {
    open: boolean
    onCreate: (project: Project) => void
  }= $props();

  let id = $state("");

  async function onSubmit(evt: SubmitEvent) {
    evt.preventDefault();

    const project = await createProject(id);
    id = "";
    onCreate(project);
  }
</script>
<SLDialog
  bind:open
  label="Create project"
>
  <SLForm id="createProjectForm" {onSubmit}>
    <SLInput
      type="text"
      bind:value={id}
      label="Project id"
      help-text="ASCII letters, digits, and the characters ., -, and _ are available."
      required
      pattern="[0-9A-Za-z][0-9A-Za-z._\-]*"
      minlength={1}
      maxlength={30}
    ></SLInput>
  </SLForm>

  {#snippet footer()}
    <SLButton onclick={() => { open = false; }}>Cancel</SLButton>
    <SLButton
      type="submit"
      form="createProjectForm"
      variant="primary"
    >Create</SLButton>
  {/snippet}
</SLDialog>
