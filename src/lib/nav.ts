export type NavLink = {
  href: string;
  label: string;
};

/** Primary site navigation for tuning clients (header + footer). */
export const primaryNav: NavLink[] = [
  { href: '/', label: 'ホーム' },
  { href: '/news/', label: 'お知らせ' },
  { href: '/profile/', label: '自己紹介と経歴' },
  { href: '/price/', label: 'ご依頼内容と料金' },
];

export const contactNav: NavLink & { labelLong: string } = {
  href: '/contact/',
  /** Desktop header — shorter for space */
  label: 'お問い合わせ',
  /** Mobile hamburger / footer — fuller form */
  labelLong: 'お問い合わせフォーム',
};

/** Professional / research area — not in header; footer banner only. */
export const labNav: NavLink = {
  href: '/lab/',
  label: 'Labo CHONO',
};

/** Footer-only secondary links. */
export const footerSecondaryNav: NavLink[] = [
  { href: '/notes/', label: '補足説明' },
];
