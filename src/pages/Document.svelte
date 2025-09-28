<script lang="ts">
  import type { Doc, Updates } from "$src/types";

  import { push } from "svelte-spa-history-router";

  import { SLIconButton, SLDropdown, SLMenu, SLMenuItem, SLDivider } from "$src/ui/shoelace";
  import asyncWorkerClient from "$src/lib/asyncWorkerClient";
  import rewriteHTML from "$src/lib/rewriteHTML";
  import DocViewer from "$src/ui/DocViewer.svelte";
  import Paper from "$src/ui/Paper.svelte";
  import FormatDateTime from "$src/ui/FormatDateTime.svelte";
  import EditDocDialog from "$src/ui/EditDocDialog.svelte"
  import Confirmation from "$src/ui/Confirmation.svelte";

  let {
    // FIXME: temporary variable for rewriteHTML
    projectId,
    key,
    getCursor,
    onUpdate,
    onDelete,
  }: {
    projectId: string
    key: string
    getCursor: () => Doc
    onUpdate: (doc: Doc, updates: Updates<Doc>) => Promise<any>
    onDelete: (key: string) => Promise<any>
  } = $props()

  let title = $state("")
  let html = $state("")

  let doc = $derived(getCursor());
  const client = asyncWorkerClient(window.navigator.serviceWorker);
  let openEditDocDialog = $state(false);
  let openDeleteConfirmation = $state(false);

  $effect(() => {
    if (doc && doc.content) {
      client.rst2html(doc.content).then((result) => {
        title = (result.title !== "") ? result.title : doc.key;
        html = rewriteHTML(result.html, {
          origin: window.origin,
          project: projectId,
          key,
        });
      });
    }
  });

  $effect(() => {
    return () => client.close();
  });

  async function onDeleteConfirmed() {
    await onDelete(doc.key)
    html = "";
    openEditDocDialog = false
    openDeleteConfirmation = false;
    push("/") // TODO: parent url
  }
</script>
<svelte:head>
  <title>{ title }</title>
</svelte:head>
<main>
  {#if doc}
    {#if html !== ""}
      <Paper>
        {#snippet meta()}
          <span>ID:{ doc.key }</span>
          <FormatDateTime value={ doc.createdAt }/>
          <SLDropdown>
            <SLIconButton sl-slot="trigger" name="three-dots" label="open menu"></SLIconButton>
            <SLMenu>
              <SLMenuItem onclick={() => openEditDocDialog = true}>Edit</SLMenuItem>
              <SLDivider></SLDivider>
              <SLMenuItem
                onclick={() => { openDeleteConfirmation = true; }}
              ><span style="color: red;">Delete</span></SLMenuItem>
            </SLMenu>
          </SLDropdown>
        {/snippet}
        <DocViewer {html} onNavigate={(path) => push(path)}></DocViewer>
      </Paper>
    {/if}
    <Confirmation
      bind:open={openDeleteConfirmation}
      label="Delete this doc?"
      onConfirm={onDeleteConfirmed}
    ></Confirmation>
    <EditDocDialog
      bind:open={openEditDocDialog}
      {doc}
      rst2html={(rst) => client.rst2html(rst).then(r => r.html)}
      onSave={onUpdate}
    ></EditDocDialog>
  {/if}
</main>
