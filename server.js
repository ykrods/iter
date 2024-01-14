/**
 * Static HTTP server with routing
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';

import { fileURLToPath } from 'node:url';


function createServer(options) {
  const { extMap, dir } = options;

  const resolvePath = (url) => {
    const pathname = new URL(url, "http://localhost/").pathname;
    // rewrite to index.html
    if (path.extname(pathname) === "") {
      return "/index.html";
    }
    return pathname;
  };

  const getContentType = (relPath) => {
    return extMap[path.extname(relPath)] || null;
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

    const relPath = resolvePath(request.url);

    const contentPath = path.join(dir, relPath);
    if (!contentPath.startsWith(dir)) {
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
    ".wasm": "application/wasm",
    ".data": "application/octet-stream",
  },
});


// Run server
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = 8080;
  console.log(`Server running on ${port}`);
  server.listen(port);
}
