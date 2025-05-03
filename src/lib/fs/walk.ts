export default async function* walk(
  handle: FileSystemDirectoryHandle,
  extensions: string[],
  relpath = ""
): AsyncGenerator<FileSystemFileHandle> {
  for await (const entry of handle.values()) {
    const key = (relpath === "") ? entry.name : `${relpath}/${entry.name}`;
    if (entry.kind === "directory") {
      yield* walk(entry, extensions, key);
    }
    if (entry.kind === "file") {
      if (extensions.some(ext => entry.name.endsWith(ext))) {
        yield entry;
      }
    }
  }
}
