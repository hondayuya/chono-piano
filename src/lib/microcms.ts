import { MICROCMS_ENDPOINTS } from '../config/microcms';
import {
  fallbackGlossary,
  fallbackLabArticles,
  fallbackNews,
  fallbackProfile,
  fallbackSettings,
  fallbackSounds,
} from './fallback';
import {
  getList,
  getListAll,
  getListDetail,
  isMicroCMSConfigured,
  useLocalMock,
} from './microcms-client';
import {
  getBundledMicroCMSImageSrc,
  loadMicroCMSAssetsManifest,
  type MicroCMSAssetsManifest,
} from './microcms-assets';
import type {
  Glossary,
  LabArticle,
  News,
  Profile,
  SiteSettings,
  Sound,
} from './types';

export {
  isMicroCMSConfigured,
  useLocalMock,
} from './microcms-client';
export {
  getBundledMicroCMSImageSrc,
  loadMicroCMSAssetsManifest,
} from './microcms-assets';
export type { MicroCMSAssetsManifest };

import localNewsMock from '../mocks/news-list.json';
import localSoundsMock from '../mocks/sounds-list.json';

const NEWS_FIELDS =
  'id,title,content,thumbnail,publishedAt,revisedAt,updatedAt,createdAt';
const SOUNDS_FIELDS =
  'id,title,url,thumbnail,publishedAt,revisedAt,updatedAt,createdAt';

function withBundledThumbnails<T extends { id: string; thumbnail?: { url: string }; revisedAt?: string; updatedAt?: string }>(
  items: T[],
  apiKey: 'news' | 'sounds',
  manifest: MicroCMSAssetsManifest,
): T[] {
  return items.map((item) => {
    const url = getBundledMicroCMSImageSrc(
      manifest,
      apiKey,
      item.id,
      'thumbnail',
      item.thumbnail?.url,
      item.revisedAt,
      item.updatedAt,
    );
    if (!url || !item.thumbnail) return item;
    return {
      ...item,
      thumbnail: { ...item.thumbnail, url },
    };
  });
}

export async function getSiteSettings(): Promise<SiteSettings> {
  // site-settings API は未接続。文言・料金などはローカル設定を使用。
  return fallbackSettings;
}

export async function getProfile(): Promise<Profile> {
  return fallbackProfile;
}

export async function getNewsList(limit = 20): Promise<News[]> {
  const manifest = loadMicroCMSAssetsManifest();

  if (useLocalMock()) {
    const list = (localNewsMock as News[]).slice(0, limit);
    return withBundledThumbnails(list, 'news', manifest);
  }

  try {
    const data = await getList<News>(MICROCMS_ENDPOINTS.news, {
      limit,
      orders: '-publishedAt',
      fields: NEWS_FIELDS,
    });
    if (!data) return withBundledThumbnails(fallbackNews, 'news', manifest);
    return withBundledThumbnails(data.contents, 'news', manifest);
  } catch (error) {
    console.warn('[microCMS] Failed to fetch news list', error);
    return withBundledThumbnails(fallbackNews, 'news', manifest);
  }
}

export async function getNewsDetail(id: string): Promise<News | null> {
  const manifest = loadMicroCMSAssetsManifest();

  if (useLocalMock()) {
    const found = (localNewsMock as News[]).find((item) => item.id === id);
    if (!found) return fallbackNews.find((item) => item.id === id) ?? null;
    return withBundledThumbnails([found], 'news', manifest)[0] ?? null;
  }

  try {
    const detail = await getListDetail<News>(MICROCMS_ENDPOINTS.news, id, {
      fields: NEWS_FIELDS,
    });
    if (detail) {
      return withBundledThumbnails([detail], 'news', manifest)[0] ?? null;
    }
  } catch (error) {
    console.warn(`[microCMS] Failed to fetch news detail: ${id}`, error);
  }

  const fallback = fallbackNews.find((item) => item.id === id) ?? null;
  return fallback
    ? withBundledThumbnails([fallback], 'news', manifest)[0] ?? null
    : null;
}

export async function getSounds(limit = 100): Promise<Sound[]> {
  const manifest = loadMicroCMSAssetsManifest();

  if (useLocalMock()) {
    const list = (localSoundsMock as Sound[]).slice(0, limit);
    return withBundledThumbnails(list, 'sounds', manifest);
  }

  try {
    const data = await getListAll<Sound>(MICROCMS_ENDPOINTS.sounds, {
      orders: '-publishedAt',
      fields: SOUNDS_FIELDS,
    });
    if (!data) {
      return withBundledThumbnails(fallbackSounds.slice(0, limit), 'sounds', manifest);
    }
    return withBundledThumbnails(data.contents.slice(0, limit), 'sounds', manifest);
  } catch (error) {
    console.warn('[microCMS] Failed to fetch sounds list', error);
    return withBundledThumbnails(fallbackSounds.slice(0, limit), 'sounds', manifest);
  }
}

/** @deprecated Use getSounds */
export async function getWorks(limit = 12): Promise<Sound[]> {
  return getSounds(limit);
}

export async function getLabArticles(limit = 50): Promise<LabArticle[]> {
  return fallbackLabArticles.slice(0, limit);
}

export async function getLabArticleDetail(id: string): Promise<LabArticle | null> {
  return fallbackLabArticles.find((item) => item.id === id) ?? null;
}

export async function getGlossary(): Promise<Glossary[]> {
  return fallbackGlossary;
}

export function formatDate(date: string | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

/** お知らせの表示日（publishedAt 優先） */
export function newsDisplayDate(item: Pick<News, 'publishedAt' | 'createdAt'>): string {
  return formatDate(item.publishedAt ?? item.createdAt);
}

/** Strip HTML tags and collapse whitespace for list excerpts. */
export function excerptFromHtml(html: string, maxLength = 120): string {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
