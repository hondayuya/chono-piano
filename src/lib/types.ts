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

/** microCMS `news` API */
export type News = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  revisedAt?: string;
  title: string;
  content: string;
  thumbnail?: MicroCMSImage;
};

/** microCMS `sounds` API（調律した音源・動画リンク） */
export type Sound = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  revisedAt?: string;
  title: string;
  url: string;
  thumbnail?: MicroCMSImage;
};

/** @deprecated Use Sound — kept as alias for gradual rename */
export type Work = Sound;

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
  fax?: string;
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
