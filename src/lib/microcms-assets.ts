/**
 * ビルド時に `integrations/vite-download-microcms-assets.mjs` が書き出すマニフェストの形。
 * manifest[apiKey][contentId][fieldId] = 公開パス（例: /_generated/news/thumbnail/xxx.webp）
 */
export type MicroCMSAssetsManifest = Record<
  string,
  Record<string, Record<string, string>>
>;

/**
 * マニフェストにローカルパスがあればそれを使い、なければ microCMS の URL を返す。
 * `revisedAt` / `updatedAt` でキャッシュバスト（CMS更新後の再デプロイ向け）。
 */
export function getBundledMicroCMSImageSrc(
  manifest: MicroCMSAssetsManifest,
  apiKey: string,
  contentId: string,
  field: string,
  remoteUrl: string | undefined,
  revisedAt?: string,
  updatedAt?: string,
): string | undefined {
  if (!remoteUrl) return undefined;
  const localPath = manifest[apiKey]?.[contentId]?.[field];
  const bust = revisedAt || updatedAt || '';
  if (localPath) {
    return bust ? `${localPath}?v=${encodeURIComponent(bust)}` : localPath;
  }
  return remoteUrl;
}

/** `import.meta.glob` でマニフェストを読む（未生成時は空） */
export function loadMicroCMSAssetsManifest(): MicroCMSAssetsManifest {
  const modules = import.meta.glob<MicroCMSAssetsManifest>(
    '../generated/microcms-assets.json',
    { eager: true, import: 'default' },
  );
  try {
    const first = Object.values(modules)[0];
    if (first && typeof first === 'object') return first;
  } catch {
    /* ignore */
  }
  return {};
}
