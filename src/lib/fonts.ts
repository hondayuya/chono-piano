/**
 * Font loading and family stacks（Google Fonts）。
 * Brand / Display: Shippori Mincho（サイト名・見出し）
 * Body: Zen Kaku Gothic New（本文・UI）
 */

export const googleFonts = {
  stylesheetHref:
    'https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600&family=Zen+Kaku+Gothic+New:wght@400;500&display=swap',
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ] as const,
} as const;

/** CSS font-family 値（global.css の --font-* と揃える） */
export const fontFamilies = {
  brand: `'Shippori Mincho', 'Hiragino Mincho ProN', 'Yu Mincho', serif`,
  display: `'Shippori Mincho', 'Hiragino Mincho ProN', 'Yu Mincho', serif`,
  body: `'Zen Kaku Gothic New', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', sans-serif`,
} as const;

export const fontRoles = {
  brand: {
    name: 'Shippori Mincho',
    provider: 'Google Fonts',
    role: 'ヘッダーのサイト名',
  },
  display: {
    name: 'Shippori Mincho',
    provider: 'Google Fonts',
    role: '見出し・キャッチ',
  },
  body: {
    name: 'Zen Kaku Gothic New',
    provider: 'Google Fonts',
    role: '本文・UI テキスト',
  },
} as const;
