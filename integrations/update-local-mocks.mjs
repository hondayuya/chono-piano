/**
 * microCMS から news / sounds を取得し、`src/mocks/*.json` を上書きします。
 *
 * 実行: `npm run update-mocks`（要 `.env` に MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY）
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

async function loadDotEnv() {
  try {
    const raw = await fs.readFile(path.join(projectRoot, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    /* .env なしはスキップ */
  }
}

const MICROCMS_LIST_PAGE_SIZE = 100;

/**
 * @param {string} domain
 * @param {string} apiKey
 * @param {string} endpoint
 * @param {Record<string, string | number | boolean | undefined>} queries
 */
async function fetchList(domain, apiKey, endpoint, queries) {
  const all = [];
  let offset = 0;
  while (true) {
    const url = new URL(`https://${domain}.microcms.io/api/v1/${endpoint}`);
    url.searchParams.set('limit', String(MICROCMS_LIST_PAGE_SIZE));
    url.searchParams.set('offset', String(offset));
    for (const [k, v] of Object.entries(queries)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
    const res = await fetch(url, {
      headers: { 'X-MICROCMS-API-KEY': apiKey },
    });
    if (!res.ok) {
      throw new Error(`${endpoint}: ${res.status} ${res.statusText}`);
    }
    const body = await res.json();
    const batch = Array.isArray(body.contents) ? body.contents : [];
    all.push(...batch);
    const totalCount =
      typeof body.totalCount === 'number' ? body.totalCount : all.length;
    if (batch.length === 0) break;
    if (batch.length < MICROCMS_LIST_PAGE_SIZE) break;
    if (all.length >= totalCount) break;
    offset += batch.length;
  }
  return all;
}

const MOCK_TARGETS = [
  {
    file: 'news-list.json',
    endpoint: 'news',
    queries: {
      orders: '-publishedAt',
      fields: 'id,title,content,thumbnail,publishedAt,revisedAt,updatedAt,createdAt',
    },
  },
  {
    file: 'sounds-list.json',
    endpoint: 'sounds',
    queries: {
      orders: '-publishedAt',
      fields: 'id,title,url,thumbnail,publishedAt,revisedAt,updatedAt,createdAt',
    },
  },
];

await loadDotEnv();

const domain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;
if (!domain || !apiKey) {
  console.error(
    '[update-mocks] MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が必要です',
  );
  process.exit(1);
}

const mocksDir = path.join(projectRoot, 'src', 'mocks');
await fs.mkdir(mocksDir, { recursive: true });

for (const target of MOCK_TARGETS) {
  const contents = await fetchList(domain, apiKey, target.endpoint, target.queries);
  const filePath = path.join(mocksDir, target.file);
  await fs.writeFile(filePath, `${JSON.stringify(contents, null, 2)}\n`, 'utf8');
  console.info(`[update-mocks] wrote ${target.file} (${contents.length})`);
}

console.info('[update-mocks] done');
