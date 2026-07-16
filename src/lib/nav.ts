export type NavLink = {
  href: string;
  label: string;
};

/** Primary site navigation for tuning clients (header + footer). */
export const primaryNav: NavLink[] = [
  { href: '/', label: 'ホーム' },
  { href: '/news/', label: 'お知らせ' },
  { href: '/profile/', label: '経歴・実績' },
];

export const contactNav: NavLink = {
  href: '/contact/',
  label: 'ご相談・連絡',
};

/** Professional / research area — not in header; footer banner only. */
export const labNav: NavLink = {
  href: '/lab/',
  label: 'Labo CHONO',
};

/** Footer-only secondary links. */
export const footerSecondaryNav: NavLink[] = [
  { href: '/notes/', label: '注釈' },
];
