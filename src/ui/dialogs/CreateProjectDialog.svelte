<script lang="ts">
  import type { Project } from "$src/types";

  import { SLButton, SLDialog, SLInput } from "$src/ui/shoelace";
  import { createProject } from "$src/lib/project/createProject";


  let {
    showRequest = $bindable(false),
    onCreate,
  }: {
    showRequest: boolean
    onCreate: (project: Project) => void
  }= $props();

  let form: HTMLFormElement;

  let id = $state("");
  let hideRequest = $state(false);

  $effect(() => {
    // form validation with shoelace component probably needs
    // to call addEventListener after component is loaded and rendered.
    // ref: https://shoelace.style/getting-started/form-controls
    if (form) {
      customElements.whenDefined('sl-input').then(() => {
        form?.addEventListener("submit", onSubmit);
      });
    }
    return () => {
      form?.removeEventListener("submit", onSubmit);
    }
  });

  async function onSubmit(evt: SubmitEvent) {
    evt.preventDefault();

    const project = await createProject(id);
    id = "";
    onCreate(project);
  }
</script>
<SLDialog
  bind:showRequest
  bind:hideRequest
  label="Create project"
>
  <form bind:this={form} id="createProjectForm" class="attention-error">
    <SLInput
      type="text"
      bind:value={id}
      label="Project id"
      help-text="The project id can only contain ASCII letters, digits, and the characters ., -, and _."
      required
      pattern="[0-9A-Za-z][0-9A-Za-z._\-]*"
      minlength={1}
      maxlength={30}
    ></SLInput>
  </form>

  {#snippet footer()}
    <SLButton onclick={() => { hideRequest = true; }}>Cancel</SLButton>
    <SLButton
      type="submit"
      form="createProjectForm"
      variant="primary"
    >Create</SLButton>
  {/snippet}
</SLDialog>
