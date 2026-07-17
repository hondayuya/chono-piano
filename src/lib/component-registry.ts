export type ComponentProp = {
  name: string;
  type: string;
  required?: boolean;
  note?: string;
};

export type ComponentCategory = 'layout' | 'content' | 'text';

export type ComponentEntry = {
  id: string;
  name: string;
  file: string;
  category: ComponentCategory;
  description: string;
  props: ComponentProp[];
  /** Page path when linkable; omit for layout-only usage. */
  usedIn: { label: string; href?: string }[];
  /** Whether the catalog page can mount a live preview. */
  preview: 'live' | 'in-layout' | 'none';
};

export const componentCategoryLabels: Record<ComponentCategory, string> = {
  layout: 'レイアウト',
  content: 'コンテンツ',
  text: 'テキスト / インライン',
};

/**
 * Catalog of reusable Astro components under `src/components/`.
 * Add an entry here whenever a new shared component is introduced.
 */
export const componentRegistry: ComponentEntry[] = [
  {
    id: 'header',
    name: 'Header',
    file: 'src/components/Header.astro',
    category: 'layout',
    description:
      'サイト共通ヘッダー。ブランド名・メインナビ・ご相談 CTA を表示します。',
    props: [
      { name: 'settings', type: 'SiteSettings', required: true },
      { name: 'currentPath', type: 'string', note: '現在ページのハイライト用。既定 `/`' },
    ],
    usedIn: [{ label: 'BaseLayout（全ページ）' }],
    preview: 'in-layout',
  },
  {
    id: 'footer',
    name: 'Footer',
    file: 'src/components/Footer.astro',
    category: 'layout',
    description:
      'サイト共通フッター。連絡先・ナビ・LabBanner を含みます。',
    props: [
      { name: 'settings', type: 'SiteSettings', required: true },
      { name: 'currentPath', type: 'string', note: '現在ページのハイライト用。既定 `/`' },
    ],
    usedIn: [{ label: 'BaseLayout（全ページ）' }],
    preview: 'in-layout',
  },
  {
    id: 'lab-banner',
    name: 'LabBanner',
    file: 'src/components/LabBanner.astro',
    category: 'content',
    description:
      'Labo CHONO への導線バナー。フッター（m）とトップ FV（s）で使用します。',
    props: [
      { name: 'settings', type: 'SiteSettings', required: true },
      { name: 'current', type: 'boolean', note: 'Lab ページ上の current 表示。既定 false' },
      { name: 'size', type: "'m' | 's'", note: '既定 m。s は FV 画像上のコンパクト版' },
      { name: 'class', type: 'string', note: '追加の class' },
    ],
    usedIn: [
      { href: '/', label: 'トップ（size=s）' },
      { label: 'Footer（全ページ・size=m）' },
    ],
    preview: 'live',
  },
  {
    id: 'news-list',
    name: 'NewsList',
    file: 'src/components/NewsList.astro',
    category: 'content',
    description:
      'お知らせ一覧。日付・タイトル・抜粋・サムネイルを縦リストで表示します。',
    props: [
      { name: 'items', type: 'News[]', required: true },
      {
        name: 'emptyText',
        type: 'string',
        note: '0件時の文言。既定「現在お知らせはありません。」',
      },
    ],
    usedIn: [
      { href: '/', label: 'トップ' },
      { href: '/news/', label: 'お知らせ一覧' },
    ],
    preview: 'live',
  },
  {
    id: 'works-row',
    name: 'WorksRow',
    file: 'src/components/WorksRow.astro',
    category: 'content',
    description:
      '実績作品の横並び行。媒体種別・アーティスト・タイトルをタイル表示します。',
    props: [{ name: 'works', type: 'Work[]', required: true }],
    usedIn: [{ href: '/', label: 'トップ' }],
    preview: 'live',
  },
  {
    id: 'heading',
    name: 'Heading',
    file: 'src/components/text/Heading.astro',
    category: 'text',
    description:
      '見出し（h1–h6）。ページ／セクション見出しの見た目を統一します。',
    props: [
      { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', note: 'HTML の見出しレベル。既定 2' },
      {
        name: 'variant',
        type: "'section' | 'meta' | 'plain'",
        note: '見た目。既定 `section`（section__title）',
      },
      { name: 'id', type: 'string' },
      { name: 'class', type: 'string' },
    ],
    usedIn: [{ label: '今後各ページで利用予定' }],
    preview: 'live',
  },
  {
    id: 'lead',
    name: 'Lead',
    file: 'src/components/text/Lead.astro',
    category: 'text',
    description: '見出し直下のリード文（section__lead）。',
    props: [{ name: 'class', type: 'string' }],
    usedIn: [{ label: '今後各ページで利用予定' }],
    preview: 'live',
  },
  {
    id: 'text',
    name: 'Text',
    file: 'src/components/text/Text.astro',
    category: 'text',
    description: '本文段落。muted で補足トーンにできます。',
    props: [
      { name: 'muted', type: 'boolean', note: '補足色。既定 false' },
      { name: 'class', type: 'string' },
    ],
    usedIn: [{ label: '今後各ページで利用予定' }],
    preview: 'live',
  },
  {
    id: 'prose',
    name: 'Prose',
    file: 'src/components/text/Prose.astro',
    category: 'text',
    description:
      '記事・紹介文などの本文コンテナ。段落・リスト・画像の余白を整えます。',
    props: [{ name: 'class', type: 'string' }],
    usedIn: [{ label: '今後各ページで利用予定' }],
    preview: 'live',
  },
  {
    id: 'list',
    name: 'List',
    file: 'src/components/text/List.astro',
    category: 'text',
    description: '箇条書き（ul）／番号付き（ol）リスト。子に `<li>` を渡します。',
    props: [
      { name: 'as', type: "'ul' | 'ol'", note: '既定 `ul`' },
      { name: 'class', type: 'string' },
    ],
    usedIn: [{ label: '今後各ページで利用予定' }],
    preview: 'live',
  },
  {
    id: 'table',
    name: 'Table',
    file: 'src/components/text/Table.astro',
    category: 'text',
    description:
      '表組み。thead / tbody / tr / th / td をスロットで渡します。',
    props: [
      { name: 'caption', type: 'string', note: '表題（任意）' },
      { name: 'class', type: 'string' },
    ],
    usedIn: [{ label: '今後各ページで利用予定' }],
    preview: 'live',
  },
  {
    id: 'link',
    name: 'Link',
    file: 'src/components/text/Link.astro',
    category: 'text',
    description:
      'リンク。通常・注釈・ボタン見た目、外部リンク属性に対応します。',
    props: [
      { name: 'href', type: 'string', required: true },
      { name: 'external', type: 'boolean', note: '新規タブ + noopener' },
      {
        name: 'variant',
        type: "'default' | 'glossary' | 'button' | 'button-ghost'",
        note: '既定 `default`',
      },
      { name: 'current', type: 'boolean', note: 'aria-current="page"' },
      { name: 'class', type: 'string' },
    ],
    usedIn: [{ label: '今後各ページで利用予定' }],
    preview: 'live',
  },
  {
    id: 'date-text',
    name: 'DateText',
    file: 'src/components/text/DateText.astro',
    category: 'text',
    description:
      '日付表示。`YYYY.MM.DD` 形式で整形し、`<time datetime>` を出力します。',
    props: [
      { name: 'date', type: 'string', required: true, note: 'ISO または YYYY-MM-DD' },
      { name: 'class', type: 'string' },
    ],
    usedIn: [{ label: '今後各ページで利用予定' }],
    preview: 'live',
  },
];

export function componentsByCategory(): {
  category: ComponentCategory;
  label: string;
  items: ComponentEntry[];
}[] {
  const order: ComponentCategory[] = ['layout', 'content', 'text'];
  return order.map((category) => ({
    category,
    label: componentCategoryLabels[category],
    items: componentRegistry.filter((entry) => entry.category === category),
  }));
}
