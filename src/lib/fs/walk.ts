/**
 * Recursively traverses a directory and yields file handles matching specified extensions.
 *
 * @param handle - The root directory handle to start traversal from.
 * @param extensions - An array of file extensions to filter files (e.g., ['.txt', '.md']).
 * @param relpath - (Optional) The relative path from the root directory; used internally during recursion.
 * @yields An object containing the file handle and its relative path from the root directory.
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
