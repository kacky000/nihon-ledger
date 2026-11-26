// Screenshots of the real site through headless Chrome's debugging protocol.
// usage: node tools/shoot.mjs <chrome.exe> <base url> <out dir> <name>=<path>@<width>x<height> ...

import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [chrome, base, outDir, ...jobs] = process.argv.slice(2);
const port = 9400 + Math.floor(Math.random() * 300);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'ledger-'))}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let wsUrl;
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
  } catch {}
  if (!wsUrl) await sleep(250);
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let seq = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  } else if (m.method === 'Runtime.exceptionThrown') console.log('EXCEPTION', JSON.stringify(m.params.exceptionDetails).slice(0, 400));
});
const send = (method, params = {}) => new Promise((r) => {
  seq += 1;
  pending.set(seq, r);
  ws.send(JSON.stringify({ id: seq, method, params }));
});
await send('Runtime.enable');

for (const job of jobs) {
  const eq = job.indexOf('=');
  const at = job.lastIndexOf('@');
  const name = job.slice(0, eq);
  const path = job.slice(eq + 1, at);
  const [w, h] = job.slice(at + 1).split('x').map(Number);
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
  await send('Page.navigate', { url: base + path });
  for (let i = 0; i < 40; i++) {
    await sleep(250);
    const r = await send('Runtime.evaluate', { expression: 'document.documentElement.dataset.ready' });
    if (r.result?.result?.value === '1') break;
  }
  await sleep(600);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(outDir, `${name}.png`), Buffer.from(shot.result.data, 'base64'));
  console.log(name, w, h);
}
ws.close();
proc.kill();
process.exit(0);
