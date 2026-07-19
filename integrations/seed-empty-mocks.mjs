/**
 * `src/mocks/*.json` が無いときだけ空配列 `[]` を書きます（既存ファイルは上書きしません）。
 * `src/generated/microcms-assets.json` が無いときだけ `{}` を書きます。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const MOCK_FILES = ['news-list.json', 'sounds-list.json'];

const mocksDir = path.join(projectRoot, 'src', 'mocks');
await fs.mkdir(mocksDir, { recursive: true });

for (const name of MOCK_FILES) {
  const filePath = path.join(mocksDir, name);
  try {
    await fs.access(filePath);
    console.info(`[seed-mocks] skip (already exists): ${name}`);
  } catch {
    await fs.writeFile(filePath, '[]\n', 'utf8');
    console.info(`[seed-mocks] wrote ${name}`);
  }
}

const generatedDir = path.join(projectRoot, 'src', 'generated');
const manifestPath = path.join(generatedDir, 'microcms-assets.json');
await fs.mkdir(generatedDir, { recursive: true });
try {
  await fs.access(manifestPath);
  console.info('[seed-mocks] skip (already exists): microcms-assets.json');
} catch {
  await fs.writeFile(manifestPath, '{}\n', 'utf8');
  console.info('[seed-mocks] wrote microcms-assets.json');
}

console.info('[seed-mocks] done');
