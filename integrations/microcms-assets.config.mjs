/**
 * 本番ビルド時に microCMS から画像を取り込む対象の一覧です。
 * `endpoint` の値は `src/config/microcms.ts` の `MICROCMS_ENDPOINTS` と揃えてください。
 *
 * @typedef {object} MicroCMSAssetImageRule
 * @property {string} field microCMS の画像フィールド API ID
 * @property {string} [pathSegment] URL 用セグメント（省略時は field から生成）
 *
 * @typedef {object} MicroCMSAssetApiRule
 * @property {string} key マニフェストのキー
 * @property {string} endpoint API スラッグ
 * @property {string[]} listFields 取り込み用一覧の `fields`
 * @property {MicroCMSAssetImageRule[]} images 取り込む画像フィールド
 */

/** @type {MicroCMSAssetApiRule[]} */
export const MICROCMS_ASSET_RULES = [
  {
    key: 'news',
    endpoint: 'news',
    listFields: ['id', 'thumbnail'],
    images: [{ field: 'thumbnail', pathSegment: 'thumbnail' }],
  },
  {
    key: 'sounds',
    endpoint: 'sounds',
    listFields: ['id', 'thumbnail'],
    images: [{ field: 'thumbnail', pathSegment: 'thumbnail' }],
  },
];
