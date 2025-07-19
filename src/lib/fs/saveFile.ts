export default async function saveFile(
  handle: FileSystemDirectoryHandle,
  path: string,
  content: string
) {
  const nodes = path.split("/");
  let parent = handle;
  for (let i = 0; i < nodes.length; i++) {
    if (i === nodes.length - 1) {
      const fileHandle = await parent.getFileHandle(nodes[i], { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
    } else {
      parent = await parent.getDirectoryHandle(nodes[i], { create: true })
    }
  }
}
