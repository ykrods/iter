import type { Doc } from "$src/types"
import parseRst from "./parseRst"

export default function deserialize(rst: string): Doc | undefined {
  const { content, meta } = parseRst(rst);

  const findMetaValue = (name: string) => meta.find(m => m.name === name)?.value;

  const key = findMetaValue("key");
  const createdAt = findMetaValue("createdAt");
  const updatedAt = findMetaValue("updatedAt");

  if (!key || !createdAt || !updatedAt) {
    return undefined;
  }
  return {
    id: key,
    key,
    title: findMetaValue("title") ?? "",
    content,
    createdAt: new Date(parseInt(createdAt)),
    updatedAt: new Date(parseInt(updatedAt)),
  };
}
