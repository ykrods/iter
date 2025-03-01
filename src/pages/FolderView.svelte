<script lang="ts">
  import type { SlSelectionChangeEvent } from "@shoelace-style/shoelace";
  import type { Project } from "$src/types";

  import { liveQuery } from "dexie";
  import { push } from "svelte-spa-history-router";

  import { SLTree, SLTreeItem } from "$src/ui/shoelace";
  import Layout from "$src/layout/Layout.svelte";
  import SidebarContent from "$src/layout/SidebarContent.svelte";
  import JournalItem from "./journal_list/JournalItem.svelte";
  import { asyncWorkerClient } from "$src/lib/asyncWorkerClient";
  import { CachedHtmlProvider } from "$src/lib/HtmlProvider";


  const client = asyncWorkerClient(navigator.serviceWorker, Promise);

  let {
    project
  } : {
    project: Project
  } = $props()

  $effect(() => {
    return () => { client.close(); };
  });

  let _items = liveQuery(async () => {
    return project.db.docs.filter(doc => doc.key.startsWith("docs")).toArray();
  });
  let items = $derived($_items);

  let root = $derived.by(() => {
    const _root = { name: "root", _type: "folder", children: [] };
    if (!items) { return _root; }

    items.forEach((item) => {
      let parent = _root;
      const pathnames = item.key.split("/");

      // Create folders
      // The first element is always docs and the last element is
      // always a file, so exclude them
      for (let i = 1; i < pathnames.length - 1; i++) {
        const name = pathnames[i];
        let node = parent.children.find(n => n.name === name);
        if (!node) {
          node = { name , _type: "folder", children: [] };
          parent.children.push(node);
        }
        parent = node;
      }
      // Create file
      parent.children.push({
        name: pathnames.at(-1),
        _type: "file",
        doc: item
      });
    });
    return _root;
  });

  function onTreeSelectionChange(e: SlSelectionChangeEvent) {
    const key = e.detail.selection[0].dataset.key;
    if (key) {
      push(project.url(`/docs/${key}`));
    }
  }
</script>
{#snippet treeItem(node)}
  {@const key = node.doc?.key }
  <SLTreeItem {key}>
    {node.name}
    {#if node._type === "folder"}
      {#each node.children as child}
        {@render treeItem(child)}
      {/each}
    {/if}
  </SLTreeItem>
{/snippet}
<svelte:head>
  <title>docs @ { project.id } | iter</title>
</svelte:head>
<Layout>
  {#snippet sidebarContent()}
    <SidebarContent {project} />
  {/snippet}

  <main id="FolderView">
    <SLTree onSelectionChange={onTreeSelectionChange}>
      {#each root.children as node}
        {@render treeItem(node)}
      {/each}
    </SLTree>
  </main>
</Layout>
<style>
  main#FolderView {
  }
</style>
