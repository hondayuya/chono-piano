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
  preview: 'brand' | 'display' | 'body' | 'section-title' | 'lead' | 'date' | 'meta';
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
      'やわらかく迎えて、静かに確かめる。入口は気軽さ、奥行きで技術の確かさを積む。白基調に胡桃ブラウンの手触りを置き、ソフトティールの差し色で焦点を締める。工房と Lab の二層で軽さと深さを役割分担する。',
    pillars: [
      {
        id: 'ease',
        title: '気軽な入口',
        body:
          '相談のハードルを下げる。短い言葉・余白・押しつけない CTA で、料金・対応範囲・連絡先がすぐ見える構成にする。専門用語は表に出さない。',
      },
      {
        id: 'craft',
        title: '静かな確かさ',
        body:
          'マイスター経歴・実績・音源を誇張せず事実で示す。権威アピールや装飾で信頼を作らず、読み進めるほど任せてよいと感じる深さを置く。',
      },
      {
        id: 'clarity',
        title: 'お客様ファーストの明快さ',
        body:
          '料金・業務・連絡先など依頼に必要な情報を迷わず読める構成にする。装飾より階層と可読性を優先する。迷わせないこと自体が信頼になる。',
      },
      {
        id: 'dual',
        title: '調律所と Lab の二層',
        body:
          '表層は調律依頼の気軽な導線、深層は Labo CHONO の研究領域。一般向けの軽さと技術の深さを役割分担し、バナーとフッターで橋渡しする。',
      },
      {
        id: 'material',
        title: '白・ブラウンと差し色',
        body:
          '白基調に胡桃ブラウンの手触りを置き、ソフトティールを差し色にする。差し色は主CTA・現在地・Lab導線に限定し、全面には使わない。',
      },
    ] satisfies DesignConceptPillar[],
  },
};

/** Color tokens defined in `src/styles/global.css` `:root`. */
export const colorTokens: ColorToken[] = [
  {
    name: 'Ink',
    cssVar: '--ink',
    value: '#2c2622',
    role: '本文・見出しの主色',
  },
  {
    name: 'Ink muted',
    cssVar: '--ink-muted',
    value: '#7a7169',
    role: 'リード文・日付・補足',
  },
  {
    name: 'Paper',
    cssVar: '--paper',
    value: '#ffffff',
    role: '背景の基調（明るい白）',
  },
  {
    name: 'Paper deep',
    cssVar: '--paper-deep',
    value: '#f7f5f2',
    role: '背景グラデーション末端（ごく淡い暖色）',
  },
  {
    name: 'Walnut',
    cssVar: '--walnut',
    value: '#7d5740',
    role: '本文リンク・ghostボタンなど暖色の基調アクセント',
  },
  {
    name: 'Walnut soft',
    cssVar: '--walnut-soft',
    value: '#9c7355',
    role: 'Walnut の補助トーン',
  },
  {
    name: 'Rosewood',
    cssVar: '--rosewood',
    value: '#b05d48',
    role: 'テキストリンクのホバーなど補助の強調',
  },
  {
    name: 'Accent',
    cssVar: '--accent',
    value: '#5a7d78',
    role: '差し色（主CTA・現在地・Lab導線）',
  },
  {
    name: 'Accent soft',
    cssVar: '--accent-soft',
    value: '#6e908a',
    role: 'Accent の補助トーン（グラデーションなど）',
  },
  {
    name: 'Line',
    cssVar: '--line',
    value: 'rgba(44, 38, 34, 0.1)',
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

/** Spacing scale (rem @ html 11px). 従来比 +20%。1.6rem ≈ 17.6px. */
export const spaceTokens: SpaceToken[] = [
  { name: 'xxs', cssVar: '--space-xxs', value: '0.48rem', role: '極小ギャップ' },
  { name: 'xs', cssVar: '--space-xs', value: '0.96rem', role: '密な余白' },
  { name: 'sm', cssVar: '--space-sm', value: '1.44rem', role: '小さめ余白' },
  { name: 'md', cssVar: '--space-md', value: '1.92rem', role: '基準余白' },
  { name: 'lg', cssVar: '--space-lg', value: '2.88rem', role: 'ブロック間' },
  { name: 'xl', cssVar: '--space-xl', value: '3.84rem', role: '大きめ余白' },
  { name: 'xxl', cssVar: '--space-xxl', value: '5.76rem', role: 'セクション補助' },
  {
    name: 'section-sm',
    cssVar: '--space-section-sm',
    value: '7.68rem',
    role: 'セクション上下（小）',
  },
  {
    name: 'section',
    cssVar: '--space-section',
    value: '11.52rem',
    role: 'セクション上下（標準）',
  },
  {
    name: 'section-lg',
    cssVar: '--space-section-lg',
    value: '15.36rem',
    role: 'セクション上下（大）',
  },
];

export const remSystem = {
  rootDefault: '11px',
  rule: '1.6rem ≈ 17.6px（html font-size が 11px のとき）。body は --font-size-body',
  designWidths: {
    pc: '1440px',
    sp: '390px',
  },
  notes: [
    'サイズ・余白・フォントは基本 rem（または em）。',
    'ブレイクポイントの media query は必ず px。',
    '本文は body の 1.6rem。14px 相当は約 1.3rem、18px 相当は約 1.65rem。',
  ],
};

/** Typography tokens and common text roles. */
export const typeTokens: TypeToken[] = [
  {
    name: 'Brand',
    cssVar: '--font-brand',
    sample: 'チョウノウ調律所',
    preview: 'brand',
    specs: 'Shippori Mincho / weight 500 / letter-spacing 0.08em',
    role: 'ヘッダーのサイト名',
  },
  {
    name: 'Display',
    cssVar: '--font-display',
    sample: 'あなたの演奏\n調律で損をして\nいませんか？',
    preview: 'display',
    specs: 'Shippori Mincho / weight 500 / palt（font-feature-settings） / letter-spacing 0.04–0.08em',
    role: '見出し・キャッチ',
  },
  {
    name: 'Body',
    cssVar: '--font-body',
    sample: 'お客様ファーストの、標準的な料金でのピアノ調律。',
    preview: 'body',
    specs: 'Zen Kaku Gothic New / weight 400 / line-height 1.75 / 1.6rem（html 11px）',
    role: '本文・UI テキスト',
  },
  {
    name: 'Section title',
    sample: 'お知らせ',
    preview: 'section-title',
    specs: 'clamp(2.8rem, 3.4vw, 3.6rem) / Display',
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
