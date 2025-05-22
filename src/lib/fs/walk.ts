/**
 * @param handle - directory handle
 * @param extensions - list of file extensions
 * @param relpath - path of the handle
 */
export default async function* walk(
  handle: FileSystemDirectoryHandle,
  extensions: string[],
  relpath = ""
): AsyncGenerator<{ handle: FileSystemFileHandle, relpath: string }> {
  for await (const entry of handle.values()) {
    const key = (relpath === "") ? entry.name : `${relpath}/${entry.name}`;
    if (entry.kind === "directory") {
      yield* walk(entry, extensions, key);
    }
    if (entry.kind === "file") {
      if (extensions.some(ext => entry.name.endsWith(ext))) {
        yield { handle: entry, relpath: key }
      }
    }
  }
}
