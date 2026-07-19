/**
 * Font loading and family stacks。
 * XServer Webフォント（優先）+ Google Fonts（フォールバック）。
 * @see https://www.xserver.ne.jp/manual/man_server_webfont_html.php
 *
 * Brand / Display: A1明朝 → Shippori Mincho（しっぽり明朝）→ システム明朝
 * Body: 中ゴシックBBB → Zen Kaku Gothic New → システムゴシック
 *
 * 本番の XServer 書体はサーバーパネル「Webフォント設定」へのドメイン登録が必要です。
 */

/** HEAD 末尾付近に置く XServer Webフォント用スクリプト */
export const xserverWebfont = {
  scriptSrc: 'https://webfonts.xserver.jp/js/xserver.js',
} as const;

/** フォールバック用 Google Fonts（しっぽり明朝・Zen Kaku） */
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
  brand: `"A1明朝", "A1 Mincho", "Shippori Mincho", "Hiragino Mincho ProN", "Yu Mincho", serif`,
  display: `"A1明朝", "A1 Mincho", "Shippori Mincho", "Hiragino Mincho ProN", "Yu Mincho", serif`,
  body: `"中ゴシックBBB", "Gothic Medium BBB", "Zen Kaku Gothic New", "Hiragino Sans", "Hiragino Kaku Gothic ProN", sans-serif`,
} as const;

export const fontRoles = {
  brand: {
    name: 'A1明朝 → Shippori Mincho',
    provider: 'XServer Webフォント / Google Fonts',
    role: 'ヘッダーのサイト名・ブランド',
  },
  display: {
    name: 'A1明朝 → Shippori Mincho',
    provider: 'XServer Webフォント / Google Fonts',
    role: '見出し・キャッチ',
  },
  body: {
    name: '中ゴシックBBB → Zen Kaku Gothic New',
    provider: 'XServer Webフォント / Google Fonts',
    role: '本文・UI テキスト',
  },
} as const;
