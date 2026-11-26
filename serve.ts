// Serves app/ at the root for local viewing: node serve.ts [port]

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./app/', import.meta.url));
const port = Number(process.argv[2] ?? 8080);
const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
};

createServer(async (req, res) => {
  const rel = normalize(decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname)).replace(/^([/\\])+/, '');
  let file = join(root, rel || 'index.html');
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(port, () => console.log(`Nihon Ledger on http://localhost:${port}`));
