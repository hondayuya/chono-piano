import type {
  Glossary,
  LabArticle,
  News,
  Profile,
  SiteSettings,
  Work,
} from './types';

export const fallbackSettings: SiteSettings = {
  companyName: 'チョウノウ調律所',
  labName: 'Labo CHONO',
  catchphrase: 'お客様ファーストの、標準的な料金でのピアノ調律。',
  aboutText:
    '「チョウノウ方式の調律」を守り、ドイツでの経験を活かした外国製ピアノや古いピアノの調律にも自信があります。仕事内容はお客様ファーストであること、標準的な料金であること。',
  businessText:
    '調律・修理・調整に加え、ピアノに関するご相談を受け付けています。購入相談も可能ですが、既に商談が進んでいる場合はお断りすることがあります。',
  feeGp: '¥22,000（税込）',
  feeUp: '¥16,500（税込）',
  areaText:
    '訪問範囲は東京周辺。都内は原則として出張費無料。その他の地域は予約時に金額をお伝えします。調律の狂いが大きい場合や修理希望がある場合は、予定を決める前に電話でお見積りが可能です。',
  address: '（住所は公開前に設定）',
  phone: '（電話番号は公開前に設定）',
  email: 'info@example.com',
  xUrl: '',
};

export const fallbackProfile: Profile = {
  name: '張能康博',
  birthText: '1953年 東京・葛飾区柴又に生まれる。',
  biography:
    '調律師として技術を磨き、ドイツでの経験も活かした調律を行う。旧「張能調律事務所」からの経緯・職歴は公開時に microCMS で更新します。',
  studios: 'スタジオ・Dig（曙橋）、メルダックスタジオ ほか',
  liveHouses: '恵比寿天窓、Comfort（高田馬場）ほか',
  discographyNote: '「Piano Soul」（ライヴシリーズ 2000年～）ほか',
};

export const fallbackNews: News[] = [
  {
    id: 'demo-hp-update',
    createdAt: '2026-07-15T00:00:00.000Z',
    updatedAt: '2026-07-15T00:00:00.000Z',
    publishedAt: '2026-07-15T00:00:00.000Z',
    revisedAt: '2026-07-15T00:00:00.000Z',
    title: 'HP更新のお知らせ',
    date: '2026-07-15',
    body: '<p>チョウノウ調律所 / Labo CHONO のホームページを公開しました。</p>',
    pinned: true,
  },
  {
    id: 'demo-open-tuning',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
    publishedAt: '2026-08-01T00:00:00.000Z',
    revisedAt: '2026-08-01T00:00:00.000Z',
    title: 'ミントホールで張能の公開調律',
    date: '2026-08-01',
    body: '<p>公開調律の詳細は microCMS で記事本文を編集してください。</p>',
  },
];

export const fallbackWorks: Work[] = [
  {
    id: 'w1',
    title: '（タイトル）',
    artist: '磯村由紀子',
    mediaType: 'cd',
  },
  {
    id: 'w2',
    title: '（タイトル）',
    artist: 'モーガン・フィッシャー',
    mediaType: 'cd',
  },
  {
    id: 'w3',
    title: '（タイトル）',
    artist: 'マル・ウォルドロン',
    mediaType: 'lp',
  },
];

export const fallbackLabArticles: LabArticle[] = [
  {
    id: 'chono-method-1',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
    publishedAt: '2026-06-01T00:00:00.000Z',
    revisedAt: '2026-06-01T00:00:00.000Z',
    title: 'チョウノウ方式の調律について（１）',
    category: 'チョウノウ方式',
    audience: 'general',
    excerpt:
      '音楽に関係する人が身近に感じられるよう、「音感」「音程」「響き」など感覚的な表現で調律を紹介します。',
    body: '<p>トップページでも触れている「チョウノウ方式の調律」の概要です。公開時に本文を充実させてください。</p>',
    series: 'チョウノウ方式',
  },
  {
    id: 'chono-method-2',
    createdAt: '2026-06-02T00:00:00.000Z',
    updatedAt: '2026-06-02T00:00:00.000Z',
    publishedAt: '2026-06-02T00:00:00.000Z',
    revisedAt: '2026-06-02T00:00:00.000Z',
    title: 'チョウノウ方式の調律について（２）技術者向き',
    category: 'チョウノウ方式',
    audience: 'technician',
    excerpt: 'インハーモニシティなど専門用語を交えた技術者向けの解説です。',
    body: '<p>技術者向けの詳細は Labo CHONO のシリーズ記事として拡充していきます。</p>',
    series: 'チョウノウ方式',
  },
];

export const fallbackGlossary: Glossary[] = [
  {
    id: 'g1',
    term: '純正律',
    reading: 'じゅんせいりつ',
    body: '純正な音程関係に基づく音律。詳細は公開時に追記します。',
  },
  {
    id: 'g2',
    term: '平均律',
    reading: 'へいきんりつ',
    body: 'オクターブを等分した音律。詳細は公開時に追記します。',
  },
];
