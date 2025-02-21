// @ts-ignore
import DOMPurify from "dompurify";

import type { IterDB } from "$src/types";
import type { AsyncWorkerClient } from "$src/lib/asyncWorkerClient";


export function HtmlProvider(
  client: AsyncWorkerClient,
) {
  return {
    async rst2html(rst: string): Promise<string> {
      const html = await client.rst2html(rst);
      return DOMPurify.sanitize(html);
    }
  }
}

export async function digestMessage(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export function CachedHtmlProvider(
  db: IterDB,
  client: AsyncWorkerClient,
) {
  return {
    async rst2html(rst: string): Promise<string> {
      const key = await digestMessage(rst);
      const c = await db.html_caches.get(key);
      if (c) {
        return c.html;
      }
      const html = await HtmlProvider(client).rst2html(rst);

      await db.html_caches.put({ key, html, createdAt: new Date() });
      return html;
    }
  };
}
