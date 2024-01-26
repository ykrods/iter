/**
 * @param {FileSystemDirectoryHandle} root
 * @param {string} path
 * @return {Promise<FileSystemFileHandle>}
 */
export async function recursiveFileHandle(root, path) {
  async function rec(handle, pathArray) {
    if (pathArray.length === 0) {
      return;
    }
    if (pathArray.length === 1) {
      return handle.getFileHandle(pathArray[0]);
    }
    const dir = pathArray.shift();
    const next = await handle.getDirectoryHandle(dir);
    return rec(next, pathArray);
  };
  return rec(root, path.split("/"));
}
