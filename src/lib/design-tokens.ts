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
      '工房と研究所の二つの顔を、落ち着いた紙の質感と明朝の見出しで表現する。派手さより信頼と読みやすさを優先する。',
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
        title: '紙・木・苔の質感',
        body:
          '紙色の背景、インクの文字、苔緑とローズウッドのアクセントで、工房・楽器・資料の雰囲気を想起させる。',
      },
    ] satisfies DesignConceptPillar[],
  },
};

/** Color tokens defined in `src/styles/global.css` `:root`. */
export const colorTokens: ColorToken[] = [
  {
    name: 'Ink',
    cssVar: '--ink',
    value: '#1c1916',
    role: '本文・見出しの主色',
  },
  {
    name: 'Ink muted',
    cssVar: '--ink-muted',
    value: '#5c564e',
    role: 'リード文・日付・補足',
  },
  {
    name: 'Paper',
    cssVar: '--paper',
    value: '#f2efe9',
    role: '背景の基調',
  },
  {
    name: 'Paper deep',
    cssVar: '--paper-deep',
    value: '#e4dfd5',
    role: '背景グラデーション末端',
  },
  {
    name: 'Moss',
    cssVar: '--moss',
    value: '#2f4a3c',
    role: 'リンク・アクセント（緑）',
  },
  {
    name: 'Moss soft',
    cssVar: '--moss-soft',
    value: '#3d5c4b',
    role: 'Moss の補助トーン',
  },
  {
    name: 'Rosewood',
    cssVar: '--rosewood',
    value: '#6a3d36',
    role: 'ホバー・強調（赤茶）',
  },
  {
    name: 'Line',
    cssVar: '--line',
    value: 'rgba(28, 25, 22, 0.14)',
    role: '区切り線・枠線',
  },
];

/** Typography tokens and common text roles. */
export const typeTokens: TypeToken[] = [
  {
    name: 'Display',
    cssVar: '--font-display',
    sample: 'チョウノウ調律所',
    preview: 'display',
    specs: "Shippori Mincho / weight 500 / letter-spacing 0.04–0.08em",
    role: '見出し・ブランド名',
  },
  {
    name: 'Body',
    cssVar: '--font-body',
    sample: 'お客様ファーストの、標準的な料金でのピアノ調律。',
    preview: 'body',
    specs: 'Zen Kaku Gothic New / weight 400 / line-height 1.75',
    role: '本文・UI テキスト',
  },
  {
    name: 'Section title',
    sample: 'お知らせ',
    preview: 'section-title',
    specs: 'clamp(1.5rem, 3vw, 2rem) / Display',
    role: 'ページ・セクション見出し（Heading section）',
  },
  {
    name: 'Lead',
    sample: '直近のお知らせ・新記事をご案内します。',
    preview: 'lead',
    specs: 'ink-muted / max-width 40rem',
    role: '見出し直下のリード（Lead）',
  },
  {
    name: 'Date',
    sample: '2026.07.15',
    preview: 'date',
    specs: '0.88rem / tabular-nums / ink-muted',
    role: '日付表示（DateText）',
  },
  {
    name: 'Meta label',
    sample: 'Development',
    preview: 'meta',
    specs: '0.78rem / letter-spacing 0.1–0.16em / uppercase',
    role: 'カテゴリラベル・小さなラベル',
  },
];
