export type ColorToken = {
  name: string;
  cssVar: string;
  value: string;
  role: string;
};

export type TypeToken = {
  name: string;
  cssVar?: string;
  sample: string;
  /** CSS class or inline preview style key used on the design page. */
  preview: 'display' | 'body' | 'section-title' | 'lead' | 'date' | 'meta';
  specs: string;
  role: string;
};

export type DesignAudience = {
  id: string;
  label: string;
  priority: 'primary' | 'secondary';
  summary: string;
  needs: string[];
};

export type DesignConceptPillar = {
  id: string;
  title: string;
  body: string;
};

/**
 * Who the site is for, and the design concept that follows from it.
 * Keep this above tokens/components — it is the source of visual decisions.
 */
export const designBrief = {
  target: {
    summary:
      'ピアノ調律・修理を依頼する一般のお客様を主対象とし、並行して技術者向けの研究情報も届ける二層構造のサイトです。',
    audiences: [
      {
        id: 'clients',
        label: '調律を依頼するお客様',
        priority: 'primary' as const,
        summary:
          '家庭・施設・演奏現場など、調律・修理・調整の相談から依頼までを行う方。料金・対応地域・信頼できる経歴をまず確認したい。',
        needs: [
          '料金と訪問範囲がすぐ分かること',
          '実績・経歴から安心できること',
          '相談・連絡の導線が明確なこと',
        ],
      },
      {
        id: 'technicians',
        label: 'ピアノ技術者・研究者',
        priority: 'secondary' as const,
        summary:
          'チョウノウ方式や調律の専門知識を学ぶ方。メインナビではなく Labo CHONO 経由で深く読める構成にする。',
        needs: [
          '専門記事へ迷わず到達できること',
          '一般向け情報と切り分けられていること',
          '用語・注釈で理解を補えること',
        ],
      },
    ] satisfies DesignAudience[],
  },
  concept: {
    summary:
      '白を基調にした画面のうえに、工房と研究所の二つの顔を載せる。明朝の見出しと胡桃ブラウンのアクセントで信頼と温かみを両立する。',
    pillars: [
      {
        id: 'craft',
        title: '職人の信頼',
        body:
          'ドイツ・マイスターの経歴と長年の現場経験を、落ち着いたトーンと余白で伝える。誇張せず、事実が主役になる。',
      },
      {
        id: 'clarity',
        title: 'お客様ファーストの明快さ',
        body:
          '料金・業務・連絡先など依頼に必要な情報を迷わず読める構成にする。装飾より階層と可読性を優先する。',
      },
      {
        id: 'dual',
        title: '調律所と Lab の二層',
        body:
          '表層は調律依頼の導線、深層は Labo CHONO の研究領域。バナーとフッターで技術者向けへ橋渡しする。',
      },
      {
        id: 'material',
        title: '白・ブラウンの温かみ',
        body:
          '白に近い背景と淡い茶の気配を基調にし、胡桃ブラウンとローズウッドでアクセントを置く。楽器・木・工房の質感を想起させる。',
      },
    ] satisfies DesignConceptPillar[],
  },
};

/** Color tokens defined in `src/styles/global.css` `:root`. */
export const colorTokens: ColorToken[] = [
  {
    name: 'Ink',
    cssVar: '--ink',
    value: '#1f1a17',
    role: '本文・見出しの主色',
  },
  {
    name: 'Ink muted',
    cssVar: '--ink-muted',
    value: '#6a6058',
    role: 'リード文・日付・補足',
  },
  {
    name: 'Paper',
    cssVar: '--paper',
    value: '#fbfaf8',
    role: '背景の基調（白寄り・暖色）',
  },
  {
    name: 'Paper deep',
    cssVar: '--paper-deep',
    value: '#f3f0ec',
    role: '背景グラデーション末端',
  },
  {
    name: 'Walnut',
    cssVar: '--walnut',
    value: '#6b4a36',
    role: 'リンク・ボタン・アクセント（胡桃ブラウン）',
  },
  {
    name: 'Walnut soft',
    cssVar: '--walnut-soft',
    value: '#8a6248',
    role: 'Walnut の補助トーン',
  },
  {
    name: 'Rosewood',
    cssVar: '--rosewood',
    value: '#9a4f3c',
    role: 'ホバー・強調（赤茶）',
  },
  {
    name: 'Line',
    cssVar: '--line',
    value: 'rgba(31, 26, 23, 0.1)',
    role: '区切り線・枠線',
  },
];

export type BreakpointToken = {
  name: string;
  cssVar: string;
  value: string;
  query: string;
  role: string;
};

export type SpaceToken = {
  name: string;
  cssVar: string;
  value: string;
  role: string;
};

/**
 * Breakpoints (px). Always write media queries in px — never rem —
 * so they stay stable while html font-size scales.
 */
export const breakpointTokens: BreakpointToken[] = [
  {
    name: 'xs',
    cssVar: '--bp-xs',
    value: '389px',
    query: '(max-width: 389px)',
    role: '極小 SP（デザイン幅 390 未満）',
  },
  {
    name: 's',
    cssVar: '--bp-s',
    value: '767px',
    query: '(max-width: 767px)',
    role: 'スマホ〜狭いタブレット（ハンバーガー切替）',
  },
  {
    name: 'm',
    cssVar: '--bp-m',
    value: '1023px',
    query: '(max-width: 1023px)',
    role: 'タブレット',
  },
  {
    name: 'l',
    cssVar: '--bp-l',
    value: '1439px',
    query: '(max-width: 1439px)',
    role: 'PC デザイン幅 1440 未満',
  },
  {
    name: 'xl',
    cssVar: '--bp-xl',
    value: '1600px',
    query: '(min-width: 1600px)',
    role: '大型ディスプレイ（ルート rem 上限へ）',
  },
];

/** Spacing scale (rem @ html 10px). 1.6rem ≈ 16px. */
export const spaceTokens: SpaceToken[] = [
  { name: 'xxs', cssVar: '--space-xxs', value: '0.4rem', role: '極小ギャップ' },
  { name: 'xs', cssVar: '--space-xs', value: '0.8rem', role: '密な余白' },
  { name: 'sm', cssVar: '--space-sm', value: '1.2rem', role: '小さめ余白' },
  { name: 'md', cssVar: '--space-md', value: '1.6rem', role: '基準余白（≈16px）' },
  { name: 'lg', cssVar: '--space-lg', value: '2.4rem', role: 'ブロック間' },
  { name: 'xl', cssVar: '--space-xl', value: '3.2rem', role: '大きめ余白' },
  { name: 'xxl', cssVar: '--space-xxl', value: '4.8rem', role: 'セクション補助' },
  {
    name: 'section-sm',
    cssVar: '--space-section-sm',
    value: '6.4rem',
    role: 'セクション上下（小）',
  },
  {
    name: 'section',
    cssVar: '--space-section',
    value: '9.6rem',
    role: 'セクション上下（標準）',
  },
  {
    name: 'section-lg',
    cssVar: '--space-section-lg',
    value: '12.8rem',
    role: 'セクション上下（大）',
  },
];

export const remSystem = {
  rootDefault: '10px',
  rule: '1.6rem ≈ 16px（html font-size が 10px のとき）',
  designWidths: {
    pc: '1440px',
    sp: '390px',
  },
  notes: [
    'サイズ・余白・フォントは基本 rem（または em）。',
    'ブレイクポイントの media query は必ず px。',
    '14px 相当は 1.4rem、16px 相当は 1.6rem。',
  ],
};

/** Typography tokens and common text roles. */
export const typeTokens: TypeToken[] = [
  {
    name: 'Display',
    cssVar: '--font-display',
    sample: 'チョウノウ調律所',
    preview: 'display',
    specs: 'Shippori Mincho / weight 500 / letter-spacing 0.04–0.08em',
    role: '見出し・ブランド名',
  },
  {
    name: 'Body',
    cssVar: '--font-body',
    sample: 'お客様ファーストの、標準的な料金でのピアノ調律。',
    preview: 'body',
    specs: 'Zen Kaku Gothic New / weight 400 / line-height 1.75 / ≈1.6rem',
    role: '本文・UI テキスト',
  },
  {
    name: 'Section title',
    sample: 'お知らせ',
    preview: 'section-title',
    specs: 'clamp(2.4rem, 3vw, 3.2rem) / Display',
    role: 'ページ・セクション見出し（Heading section）',
  },
  {
    name: 'Lead',
    sample: '直近のお知らせ・新記事をご案内します。',
    preview: 'lead',
    specs: 'ink-muted / max-width 64rem',
    role: '見出し直下のリード（Lead）',
  },
  {
    name: 'Date',
    sample: '2026.07.15',
    preview: 'date',
    specs: '1.41rem / tabular-nums / ink-muted',
    role: '日付表示（DateText）',
  },
  {
    name: 'Meta label',
    sample: 'Development',
    preview: 'meta',
    specs: '1.25rem / letter-spacing 0.1–0.16em / uppercase',
    role: 'カテゴリラベル・小さなラベル',
  },
];
