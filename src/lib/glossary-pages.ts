import {
  getGlossary,
  getLabArticles,
  getNewsList,
  getProfile,
} from './microcms';
import type { GlossarySourcePage } from './glossary';
import { collectGlossaryUsages } from './glossary';
import type { Glossary } from './types';

export async function getGlossaryWithUsages(): Promise<{
  glossary: Glossary[];
  usages: Record<string, { href: string; title: string }[]>;
}> {
  const [glossary, news, labArticles, profile] = await Promise.all([
    getGlossary(),
    getNewsList(100),
    getLabArticles(100),
    getProfile(),
  ]);

  const pages: GlossarySourcePage[] = [
    ...news.map((item) => ({
      href: `/news/${item.id}/`,
      title: item.title,
      html: item.body,
    })),
    ...labArticles.map((item) => ({
      href: `/lab/${item.id}/`,
      title: item.title,
      html: item.body,
    })),
    {
      href: '/profile/',
      title: `${profile.name}の経歴`,
      html: profile.biography,
    },
  ];

  return {
    glossary,
    usages: collectGlossaryUsages(glossary, pages),
  };
}
