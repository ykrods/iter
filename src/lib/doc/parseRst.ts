type RstMeta = {
  name: string,
  value: string,
}

type ParseRstResult = {
  content: string,
  meta: RstMeta[],
}

/**
 * split meta directive appended by app
 */
function parseRst(rst: string): ParseRstResult {
  const pos = rst.lastIndexOf(".. meta::");

  if (pos === -1) {
    return { content: rst, meta: [] };
  }

  const content = rst.substring(0, pos)
  const meta_part = rst.substring(pos)

  const meta: RstMeta[] = []
  meta_part.split("\n").forEach((line) => {
    const r = line.match(/^ +:it-(.+): (.+)$/);
    if (r) {
      meta.push({ name: r[1], value: r[2] });
    }
  });

  return { content, meta };
}

export default parseRst;
