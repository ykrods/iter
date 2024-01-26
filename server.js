/**
 * Static HTTP server with routing
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';

import { fileURLToPath } from 'node:url';


/**
 *  @param {Object} options
 *  @param {string} options.dir - directory to serve
 *  @param {Object.<string, string>} options.extMap - mapping file extensions to MIME types
 *  @param {(path: string) => string} [options.rewrite] - (optional) rewrite path function
 */
function createServer(options) {
  const getContentType = (contentPath) => {
    return options.extMap[path.extname(contentPath)] || null;
  };

  const log = (code, request) => {
    console.log(`[${(new Date()).toISOString()}] (${code}) ${request.method} ${request.url}`);
  };

  const handler = async (request, response) => {
    if (request.method.toUpperCase() !== "GET") {
      response.writeHead(405, {'Content-Type': 'text/plain'});
      response.end("Method Not Allowed", 'utf-8');
      log(405, request);
      return;
    }

    let p = new URL(request.url, `http://${request.headers.host}`).pathname;
    if (options.rewrite instanceof Function) {
      p = options.rewrite(p);
    }
    const contentPath = path.join(options.dir, p);

    if (!contentPath.startsWith(options.dir)) {
      throw new Error("invalid request");
    }

    const contentType = getContentType(contentPath);
    if (contentType === null || !fs.existsSync(contentPath)) {
      response.writeHead(404, {'Content-Type': 'text/plain'});
      response.end("Not Found", 'utf-8');
      log(404, request);
      return;
    }

    const encoding = contentType.startsWith('text') ? 'utf-8' : null;
    const content = await fs.promises.readFile(contentPath, { encoding });

    response.writeHead(200, {'Content-Type': contentType });
    response.end(content, encoding);
    log(200, request);
  }

  return http.createServer(async (request, response) => {
    try {
      await handler(request, response);
    } catch(error) {
      response.writeHead(500, {'Content-Type': 'text/plain'});
      response.end("Internal Server Error", 'utf-8');
      console.error(error);
      log(500, request);
    }
  });
}

export const server = createServer({
  dir: "public",
  extMap: {
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "text/json",
    ".map": "application/octet-stream",
    ".html": "text/html",
    ".svg": "image/svg+xml",
    ".wasm": "application/wasm",
    ".data": "application/octet-stream",
  },
  rewrite(pathname) {
    // rewrite to index.html
    const rewriteConds = [
      path.extname(pathname) === "",
      pathname.startsWith("/p/"),
      pathname.startsWith("/a/"),
    ];
    if (rewriteConds.some(v => v)) {
      return "/index.html";
    }
    return pathname;
  }
});


// Run server
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = 8080;
  console.log(`Server running on ${port}`);
  server.listen(port);
}
