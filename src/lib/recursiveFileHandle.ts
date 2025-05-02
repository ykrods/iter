/**
 * get FileSystemFileHandle from path
 *
 * @throw Error if file does not exist
 */
export async function recursiveFileHandle(
  root: FileSystemDirectoryHandle,
  path: string,
): Promise<FileSystemFileHandle> {
  async function rec(
    handle: FileSystemDirectoryHandle,
    pathArray: string[]
  ): Promise<FileSystemFileHandle> {
    if (pathArray.length === 0) {
      throw new Error("FileDoesNotExists");
    }
    if (pathArray.length === 1) {
      return handle.getFileHandle(pathArray[0]);
    }
    const dir = pathArray.shift()!;
    const next = await handle.getDirectoryHandle(dir);
    return rec(next, pathArray);
  };
  return rec(root, path.split("/"));
}
