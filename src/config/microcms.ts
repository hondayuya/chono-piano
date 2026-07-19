/**
 * microCMS API エンドポイントを意味名で管理します。
 * 新しい API が増えたらここに追記してください。
 */
export const MICROCMS_ENDPOINTS = {
  news: 'news',
  sounds: 'sounds',
} as const;

export type MicroCMSEndpointKey = keyof typeof MICROCMS_ENDPOINTS;
