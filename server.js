/**
 * Static HTTP server with routing
 */
import fs from 'fs';
import http from 'http';
import path from 'path';
import process from 'process';

import { fileURLToPath } from 'url';

const STATIC_DIR = 'public';


// https://gist.github.com/lovasoa/8691344
function* walkSync(dir, root=null) {
  root = root || dir;
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  for (const d of dirents) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walkSync(entry, root);
    else if (d.isFile()) yield path.relative(root, entry);
  }
}

const resolveFile = (() => {
  const availables = new Set(walkSync(STATIC_DIR))

  return (url) => {
    if (availables.has(url.slice(1))) {
      return url;
    }
    // unexpected requests
    if (['.css', '.js', '.map', '.ico', 'wasm', 'json'].includes(path.extname(url))) {
      return null;
    }
    // rewrite to index.html
    return 'index.html';
  }
})();

function getContentType(filePath) {
  const extMap = {
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'text/json',
    '.map': 'application/octet-stream',
    '.html': 'text/html',
    '.wasm': "application/wasm",
    '.data': "application/octet-stream",
  }
  return extMap[path.extname(filePath)] || 'text/plain';
}

export const server = http.createServer(async (request, response) => {
  const filePath = resolveFile(request.url);

  if (filePath === null) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end("Not Found", 'utf-8');
    console.log(`[${(new Date()).toISOString()}] (404) ${request.method} ${request.url}`);
    return;
  }

  const contentType = getContentType(filePath);
  const encoding = contentType.startsWith('text') ? 'utf-8' : null;
  const content = await fs.promises.readFile(path.join(STATIC_DIR, filePath), { encoding });

  response.writeHead(200, {'Content-Type': contentType});
  response.end(content, 'utf-8');
  console.log(`[${(new Date()).toISOString()}] (200) ${request.method} ${request.url}`);
});

// Run server
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = 8080;
  server.listen(port);
  console.log(`Server running on ${port}`);
}
