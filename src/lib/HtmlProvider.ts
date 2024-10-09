// @ts-ignore
import DOMPurify from "dompurify/dist/purify.es.mjs";

import type { IterDB } from "$src/types";
import type { AsyncWorkerClient } from "$src/lib/asyncWorkerClient";

export async function digestMessage(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export function HtmlProvider(db: IterDB, client: AsyncWorkerClient) {
  return {
    async get(rst: string) {
      let html = await client.rst2html(rst);
      html = DOMPurify.sanitize(html);

      return html;
    },
    async getWithCache(rst: string) {
      const key = await digestMessage(rst);
      const c = await db.html_caches.get(key);
      if (c) {
        return c.html;
      }
      const html = await this.get(rst);
      await db.html_caches.put({ id: key, html, createdAt: new Date() });
    }
  };
}