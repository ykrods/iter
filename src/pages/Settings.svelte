<script lang="ts">
  import type { Project, Doc } from "$src/types";

  import { downloadZip } from "client-zip";

  import { generateId } from "$src/lib/core/id";

  import { SLButton } from "$src/ui/shoelace";

  import Layout from "$src/layout/Layout.svelte";
  import SidebarContent from "$src/layout/SidebarContent.svelte";

  type Meta = { name: string, value: string }

  let {
    project
  } : {
    project: Project
  } = $props();

  let files: FileList | undefined = $state()


  async function importDir() {
    if (!files) {
      return;
    }

    for await (const file of files) {
      if (file.name.endsWith(".rst")) {
        const rst = await file.text();
        const doc = buildDoc(file.webkitRelativePath, rst);
        await project.db.docs.put(doc);
      }
    }
  }

  /**
   * parse on js need to exclude meta directive from content
   */
  function parseRst(rst: string): { content: string, meta: Meta[] } {
    const pos = rst.lastIndexOf(".. meta::");

    if (pos === -1) {
      return { content: rst, meta: [] };
    }

    const content = rst.substring(0, pos)
    const meta_part = rst.substring(pos)

    const meta: Meta[] = []
    meta_part.split("\n").forEach((line) => {
      const r = line.match(/^ +:it-(.+): (.+)$/);
      if (r) {
        meta.push({ name: r[1], value: r[2] });
      }
    });

    return { content, meta };
  }

  function buildDoc(relPath: string, rst: string): Doc {
    const { content, meta } = parseRst(rst);

    const key = meta.find(m => m.name === "key")?.value;
    const createdAt = meta.find(m => m.name === "createdAt")?.value;
    const updatedAt = meta.find(m => m.name === "updatedAt")?.value;

    return {
      // WIP: id 生成する？
      key: key ?? relPath,
      content,
      createdAt: createdAt ? new Date(parseInt(createdAt)) : new Date(),
      updatedAt: updatedAt ? new Date(parseInt(updatedAt)) : new Date(),
    }
  }

  function buildContent(doc: Doc) {
    return `${doc.content}

.. meta::
  :it-key: ${doc.key}
  :it-createdAt: ${doc.createdAt.getTime()}
  :it-updatedAt: ${doc.updatedAt.getTime()}`;
  }

  async function exportZip() {
    const docs = await project.db.docs.toArray();

    const files = docs.map((doc) => ({
      name: `${project.id}/${doc.key}`,
      lastModified: doc.updatedAt,
      input: buildContent(doc),
    }));
    const blob = await downloadZip(files).blob();

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${project.id}.zip`;
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }
</script>
<Layout>
  {#snippet sidebarContent()}
    <SidebarContent {project} />
  {/snippet}

  <main class="settings">
    <input type="file" bind:files name="fileList" webkitdirectory multiple />
    <SLButton onclick={importDir}>import</SLButton>
    <SLButton onclick={exportZip}>export</SLButton>
  </main>
</Layout>
