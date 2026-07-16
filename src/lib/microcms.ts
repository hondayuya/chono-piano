import { createClient } from 'microcms-js-sdk';
import {
  fallbackGlossary,
  fallbackLabArticles,
  fallbackNews,
  fallbackProfile,
  fallbackSettings,
  fallbackWorks,
} from './fallback';
import type {
  Glossary,
  LabArticle,
  MicroCMSListResponse,
  News,
  Profile,
  SiteSettings,
  Work,
} from './types';

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;
const hasCredentials = Boolean(serviceDomain && apiKey);

const client = hasCredentials
  ? createClient({
      serviceDomain,
      apiKey,
    })
  : null;

async function getList<T>(
  endpoint: string,
  queries?: Record<string, unknown>,
): Promise<MicroCMSListResponse<T> | null> {
  if (!client) return null;
  try {
    return await client.getList<T>({ endpoint, queries });
  } catch (error) {
    console.warn(`[microCMS] Failed to fetch list: ${endpoint}`, error);
    return null;
  }
}

async function getObject<T>(endpoint: string): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.getObject<T>({ endpoint });
  } catch (error) {
    console.warn(`[microCMS] Failed to fetch object: ${endpoint}`, error);
    return null;
  }
}

async function getListDetail<T>(
  endpoint: string,
  contentId: string,
): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.getListDetail<T>({ endpoint, contentId });
  } catch (error) {
    console.warn(`[microCMS] Failed to fetch detail: ${endpoint}/${contentId}`, error);
    return null;
  }
}

export function isMicroCMSConfigured(): boolean {
  return hasCredentials;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await getObject<SiteSettings>('site-settings');
  return data ?? fallbackSettings;
}

export async function getProfile(): Promise<Profile> {
  const data = await getObject<Profile>('profile');
  return data ?? fallbackProfile;
}

export async function getNewsList(limit = 20): Promise<News[]> {
  const data = await getList<News>('news', {
    limit,
    orders: '-date',
  });
  if (!data) return fallbackNews;
  return data.contents;
}

export async function getNewsDetail(id: string): Promise<News | null> {
  const detail = await getListDetail<News>('news', id);
  if (detail) return detail;
  return fallbackNews.find((item) => item.id === id) ?? null;
}

export async function getWorks(limit = 12): Promise<Work[]> {
  const data = await getList<Work>('works', { limit, orders: '-publishedAt' });
  return data?.contents ?? fallbackWorks;
}

export async function getLabArticles(limit = 50): Promise<LabArticle[]> {
  const data = await getList<LabArticle>('lab-articles', {
    limit,
    orders: '-publishedAt',
  });
  return data?.contents ?? fallbackLabArticles;
}

export async function getLabArticleDetail(id: string): Promise<LabArticle | null> {
  const detail = await getListDetail<LabArticle>('lab-articles', id);
  if (detail) return detail;
  return fallbackLabArticles.find((item) => item.id === id) ?? null;
}

export async function getGlossary(): Promise<Glossary[]> {
  const data = await getList<Glossary>('glossary', {
    limit: 100,
    orders: 'term',
  });
  return data?.contents ?? fallbackGlossary;
}

export function formatDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
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
