import type { Glossary } from './types';

export type GlossaryRef = {
  href: string;
  title: string;
};

export type GlossarySourcePage = {
  href: string;
  title: string;
  html: string;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sortedTerms(glossary: Glossary[]): Glossary[] {
  return [...glossary].sort((a, b) => b.term.length - a.term.length);
}

/**
 * Insert links to /notes/#id for glossary terms found in HTML text nodes.
 * Skips text inside existing anchors and script/style tags.
 */
export function applyGlossaryLinks(html: string, glossary: Glossary[]): string {
  if (!html || glossary.length === 0) return html;

  const terms = sortedTerms(glossary).filter((item) => item.term.trim() !== '');
  if (terms.length === 0) return html;

  const parts = html.split(/(<[^>]+>)/g);

  let inAnchor = 0;
  let inSkip = 0;

  return parts
    .map((part) => {
      if (part.startsWith('<')) {
        const lower = part.toLowerCase();
        if (/^<a(\s|>)/.test(lower)) inAnchor += 1;
        if (/^<\/a\s*>/.test(lower)) inAnchor = Math.max(0, inAnchor - 1);
        if (/^<(script|style)(\s|>)/.test(lower)) inSkip += 1;
        if (/^<\/(script|style)\s*>/.test(lower)) inSkip = Math.max(0, inSkip - 1);
        return part;
      }

      if (inAnchor > 0 || inSkip > 0 || part === '') return part;

      let text = part;
      for (const item of terms) {
        const pattern = new RegExp(escapeRegExp(item.term), 'g');
        text = text.replace(
          pattern,
          `<a class="glossary-link" href="/notes/#${item.id}">${item.term}</a>`,
        );
      }
      return text;
    })
    .join('');
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Map glossary id → pages that mention the term. */
export function collectGlossaryUsages(
  glossary: Glossary[],
  pages: GlossarySourcePage[],
): Record<string, GlossaryRef[]> {
  const usages: Record<string, GlossaryRef[]> = {};
  const terms = sortedTerms(glossary).filter((item) => item.term.trim() !== '');

  for (const item of terms) {
    usages[item.id] = [];
  }

  for (const page of pages) {
    const plain = htmlToPlainText(page.html);
    if (!plain) continue;

    for (const item of terms) {
      if (!plain.includes(item.term)) continue;
      const list = usages[item.id] ?? [];
      if (!list.some((ref) => ref.href === page.href)) {
        list.push({ href: page.href, title: page.title });
      }
      usages[item.id] = list;
    }
  }

  return usages;
}
