/**
 * Font loading and family stacks（XServer Webフォント）。
 * @see https://www.xserver.ne.jp/manual/man_server_webfont_html.php
 *
 * 明朝（ブランド）: A1明朝
 * 見出しゴシック: 見出しゴMB31
 * 本文: 中ゴシックBBB
 *
 * 本番ではサーバーパネルの「Webフォント設定」にドメイン登録が必要です。
 */

/** HEAD 末尾付近に置く XServer Webフォント用スクリプト */
export const xserverWebfont = {
  scriptSrc: 'https://webfonts.xserver.jp/js/xserver.js',
} as const;

/** CSS font-family 値（global.css の --font-* と揃える） */
export const fontFamilies = {
  brand: `"A1明朝", "A1 Mincho", "Hiragino Mincho ProN", "Yu Mincho", serif`,
  display: `"見出しゴMB31", "Midashi Go MB31", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif`,
  body: `"中ゴシックBBB", "Gothic Medium BBB", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif`,
} as const;

export const fontRoles = {
  brand: {
    name: 'A1明朝',
    provider: 'XServer Webフォント',
    role: 'ヘッダーのサイト名・ブランド',
  },
  display: {
    name: '見出しゴMB31',
    provider: 'XServer Webフォント',
    role: '見出し・キャッチ',
  },
  body: {
    name: '中ゴシックBBB',
    provider: 'XServer Webフォント',
    role: '本文・UI テキスト',
  },
} as const;
