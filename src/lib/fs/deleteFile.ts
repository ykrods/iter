export default async function deleteFile(
  handle: FileSystemDirectoryHandle,
  path: string,
) {
  const nodes = path.split("/");
  let parent = handle;
  for (let i = 0; i < nodes.length; i++) {
    if (i === nodes.length - 1) {
      await parent.removeEntry(nodes[i]);
    } else {
      parent = await parent.getDirectoryHandle(nodes[i])
    }
  }
}
