export type BreadcrumbItem = {
  label: string;
  /** 省略時は現在地（リンクなし） */
  href?: string;
};

const PATH_LABELS: Record<string, string> = {
  '/news/': 'お知らせ',
  '/profile/': '経歴・実績',
  '/notes/': '注釈',
  '/lab/': 'Labo CHONO',
  '/contact/': 'ご相談・連絡',
  '/contact/thanks/': '送信完了',
  '/contact/error/': '送信エラー',
  '/design/': 'デザインシステム',
  '/design/fv/': 'FV検証',
  '/design/about/': 'About検証',
  '/design/buttons/': 'ボタン検証',
  '/design/sounds/': '音源カード検証',
};

/**
 * 下層ページ用パンくず。トップ（`/`）では `null`。
 * `trail` を渡すとその続き（例: お知らせ > 記事タイトル）。
 */
export function resolveBreadcrumbs(
  currentPath: string,
  trail?: BreadcrumbItem[],
): BreadcrumbItem[] | null {
  if (!currentPath || currentPath === '/') return null;

  const home: BreadcrumbItem = { label: 'ホーム', href: '/' };
  const normalized = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;

  if (trail && trail.length > 0) {
    return [home, ...trail];
  }

  if (PATH_LABELS[normalized]) {
    // 親パスがある場合は親も挟む（例: /contact/thanks/）
    const segments = normalized.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [home];
    let acc = '/';
    for (let i = 0; i < segments.length; i++) {
      acc += `${segments[i]}/`;
      const label = PATH_LABELS[acc];
      if (!label) continue;
      const isLast = i === segments.length - 1;
      items.push(isLast ? { label } : { label, href: acc });
    }
    return items.length > 1 ? items : [home, { label: PATH_LABELS[normalized] }];
  }

  return [home];
}
