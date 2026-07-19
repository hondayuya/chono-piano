/**
 * microCMS REST API クライアント（ビルド時取得を想定）。
 * @see https://document.microcms.io/content-api/get-content-overview
 */

import type { MicroCMSListResponse } from './types';

function requireEnv(
  name: 'MICROCMS_SERVICE_DOMAIN' | 'MICROCMS_API_KEY',
): string | null {
  const v = import.meta.env[name];
  if (v == null || v === '') return null;
  return v;
}

function baseUrl(): URL | null {
  const domain = requireEnv('MICROCMS_SERVICE_DOMAIN');
  if (!domain) return null;
  return new URL(`https://${domain}.microcms.io/api/v1/`);
}

/** microCMS 一覧 API の 1 リクエストあたりの最大 `limit`（超えるとエラー） */
const MICROCMS_LIST_PAGE_SIZE = 100;

export function isMicroCMSConfigured(): boolean {
  return Boolean(requireEnv('MICROCMS_SERVICE_DOMAIN') && requireEnv('MICROCMS_API_KEY'));
}

export function useLocalMock(): boolean {
  return import.meta.env.USE_LOCAL_MOCK === 'true';
}

/**
 * 一覧取得 `GET /api/v1/{endpoint}`
 */
export async function getList<T>(
  endpoint: string,
  queries: Record<string, string | number | boolean | undefined> = {},
): Promise<MicroCMSListResponse<T> | null> {
  const key = requireEnv('MICROCMS_API_KEY');
  const b = baseUrl();
  if (!key || !b) return null;

  const url = new URL(`${endpoint}`, b);
  for (const [k, v] of Object.entries(queries)) {
    if (v === undefined) continue;
    url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: { 'X-MICROCMS-API-KEY': key },
  });
  if (!res.ok) {
    throw new Error(`microCMS getList: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as MicroCMSListResponse<T>;
}

/**
 * 一覧を全件取得（`limit=100` と `offset` でページング）。
 * `queries` に `limit` / `offset` を含めても無視されます。
 */
export async function getListAll<T>(
  endpoint: string,
  queries: Record<string, string | number | boolean | undefined> = {},
): Promise<MicroCMSListResponse<T> | null> {
  const key = requireEnv('MICROCMS_API_KEY');
  const b = baseUrl();
  if (!key || !b) return null;

  const allContents: T[] = [];
  let offset = 0;

  while (true) {
    const url = new URL(`${endpoint}`, b);
    for (const [k, v] of Object.entries(queries)) {
      if (v === undefined || k === 'limit' || k === 'offset') continue;
      url.searchParams.set(k, String(v));
    }
    url.searchParams.set('limit', String(MICROCMS_LIST_PAGE_SIZE));
    url.searchParams.set('offset', String(offset));

    const res = await fetch(url, {
      headers: { 'X-MICROCMS-API-KEY': key },
    });
    if (!res.ok) {
      throw new Error(`microCMS getListAll: ${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as MicroCMSListResponse<T>;
    const batch = Array.isArray(data.contents) ? data.contents : [];
    allContents.push(...batch);
    const totalCount =
      typeof data.totalCount === 'number' ? data.totalCount : allContents.length;
    if (batch.length === 0) break;
    if (batch.length < MICROCMS_LIST_PAGE_SIZE) break;
    if (allContents.length >= totalCount) break;
    offset += batch.length;
  }

  return {
    contents: allContents,
    totalCount: allContents.length,
    offset: 0,
    limit: allContents.length,
  };
}

/**
 * 詳細取得 `GET /api/v1/{endpoint}/{contentId}`
 */
export async function getListDetail<T>(
  endpoint: string,
  contentId: string,
  queries: Record<string, string | number | boolean | undefined> = {},
): Promise<T | null> {
  const key = requireEnv('MICROCMS_API_KEY');
  const b = baseUrl();
  if (!key || !b) return null;

  const url = new URL(`${endpoint}/${contentId}`, b);
  for (const [k, v] of Object.entries(queries)) {
    if (v === undefined) continue;
    url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: { 'X-MICROCMS-API-KEY': key },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`microCMS getListDetail: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}
