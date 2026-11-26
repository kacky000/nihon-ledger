// Hands in Nihon Ledger: copies the static site and its screenshots to the output
// folder and writes the dossier with the kit's library. MAKEFUN_OUTPUT_DIR stands in for /output.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repo = fileURLToPath(new URL('.', import.meta.url));
const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(output, { recursive: true });
cpSync(join(repo, 'app'), join(output, 'app'), { recursive: true });
mkdirSync(join(output, 'screenshots'), { recursive: true });
if (existsSync(join(repo, 'screenshots'))) cpSync(join(repo, 'screenshots'), join(output, 'screenshots'), { recursive: true });

writeFileSync(
  join(output, 'dossier.json'),
  buildDossier(output, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
console.log(`Nihon Ledger handed in to ${output}`);
