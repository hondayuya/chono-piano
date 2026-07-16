export type MicroCMSImage = {
  url: string;
  height?: number;
  width?: number;
};

export type MicroCMSListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type News = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  date: string;
  body: string;
  eyecatch?: MicroCMSImage;
};

export type LabArticle = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  category: string;
  excerpt?: string;
  body: string;
  audience?: 'general' | 'technician';
  series?: string;
};

export type Work = {
  id: string;
  title: string;
  artist: string;
  mediaType: 'lp' | 'cd' | 'other';
  jacket?: MicroCMSImage;
  url?: string;
  note?: string;
};

export type Glossary = {
  id: string;
  term: string;
  reading?: string;
  body: string;
};

export type SiteSettings = {
  companyName: string;
  labName: string;
  catchphrase?: string;
  aboutText?: string;
  businessText?: string;
  feeGp?: string;
  feeUp?: string;
  areaText?: string;
  address?: string;
  phone?: string;
  email?: string;
  xUrl?: string;
  heroImage?: MicroCMSImage;
};

export type Profile = {
  name: string;
  birthText?: string;
  biography: string;
  studios?: string;
  liveHouses?: string;
  discographyNote?: string;
};
