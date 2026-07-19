/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly MICROCMS_SERVICE_DOMAIN: string | undefined;
  readonly MICROCMS_API_KEY: string | undefined;
  /**
   * `"true"` のとき microCMS を呼ばずローカルモック JSON を使います。
   * 本番ビルド時の画像取り込みもスキップされます。
   */
  readonly USE_LOCAL_MOCK: string | undefined;
  readonly PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
