import fsPromises from "node:fs/promises";
import path from "node:path";
import { MICROCMS_ASSET_RULES } from "./microcms-assets.config.mjs";

/** `import.meta.url` 基準だと Astro が設定をバンドルする際にズレるため、常に cwd を使う */
const projectRoot = process.cwd();

const manifestPath = path.join(
  projectRoot,
  "src",
  "generated",
  "microcms-assets.json"
);

/** microCMS 一覧 API の 1 リクエストあたりの最大 limit（全件取得時のページサイズ） */
const MICROCMS_LIST_PAGE_SIZE = 100;

/**
 * @param {string} domain
 * @param {string} apiKey
 * @param {string} endpoint
 * @param {Record<string, string>} fixedParams fields / orders など（limit/offset は上書き）
 */
async function fetchAllListContents(domain, apiKey, endpoint, fixedParams) {
  const all = [];
  let offset = 0;
  while (true) {
    const listUrl = new URL(
      `https://${domain}.microcms.io/api/v1/${endpoint}`
    );
    for (const [k, v] of Object.entries(fixedParams)) {
      listUrl.searchParams.set(k, v);
    }
    listUrl.searchParams.set("limit", String(MICROCMS_LIST_PAGE_SIZE));
    listUrl.searchParams.set("offset", String(offset));

    const listRes = await fetch(listUrl, {
      headers: { "X-MICROCMS-API-KEY": apiKey },
    });
    if (!listRes.ok) {
      return { ok: false, status: listRes.status, contents: [] };
    }
    const data = await listRes.json();
    const batch = Array.isArray(data.contents) ? data.contents : [];
    all.push(...batch);
    const totalCount =
      typeof data.totalCount === "number" ? data.totalCount : all.length;
    if (batch.length === 0) break;
    if (batch.length < MICROCMS_LIST_PAGE_SIZE) break;
    if (all.length >= totalCount) break;
    offset += batch.length;
  }
  return { ok: true, status: 200, contents: all };
}

/** Astro が Vite の `buildStart` を複数回呼ぶことがあり、二重取得を防ぐ */
let microCMSAssetsDownloadDone = false;

/**
 * 本番ビルド時のみ: `MICROCMS_ASSET_RULES` に従い microCMS から画像を取得し
 * `public/_generated/` に保存し、`src/generated/microcms-assets.json` を更新します。
 */
export function downloadMicroCMSAssetsPlugin() {
  return {
    name: "download-microcms-assets",
    apply: "build",
    async buildStart() {
      if (microCMSAssetsDownloadDone) return;

      const writeEmptyManifest = async () => {
        await fsPromises.mkdir(path.dirname(manifestPath), { recursive: true });
        await fsPromises.writeFile(manifestPath, "{}\n", "utf8");
      };

      // Cloudflare Pages など、ビルド環境の env を直接参照する。
      // Vite の loadEnv は prefix の挙動などで非 production ブランチで読み漏らすことがあるため使用しない。
      const env = process.env;

      // デバッグ用ログ（値そのものは出さない）。問題が解決したら削除してOK。
      console.info("[download-microcms-assets] env check", {
        branch:
          env.WORKERS_CI_BRANCH ??
          env.CF_PAGES_BRANCH ??
          env.GIT_BRANCH ??
          "unknown",
        hasDomain: Boolean(env.MICROCMS_SERVICE_DOMAIN),
        hasApiKey: Boolean(env.MICROCMS_API_KEY),
        useLocalMock: env.USE_LOCAL_MOCK ?? null,
      });

      if (env.USE_LOCAL_MOCK === "true") {
        console.info("[download-microcms-assets] skipped (USE_LOCAL_MOCK=true)");
        await writeEmptyManifest();
        microCMSAssetsDownloadDone = true;
        return;
      }

      const domain = env.MICROCMS_SERVICE_DOMAIN;
      const apiKey = env.MICROCMS_API_KEY;
      if (!domain || !apiKey) {
        console.warn(
          "[download-microcms-assets] skipped (MICROCMS_SERVICE_DOMAIN or MICROCMS_API_KEY missing)"
        );
        await writeEmptyManifest();
        microCMSAssetsDownloadDone = true;
        return;
      }

      if (!MICROCMS_ASSET_RULES.length) {
        console.info("[download-microcms-assets] no rules configured");
        await writeEmptyManifest();
        microCMSAssetsDownloadDone = true;
        return;
      }

      const generatedRoot = path.join(projectRoot, "public", "_generated");
      await fsPromises.rm(generatedRoot, { recursive: true, force: true });

      /** @type {Record<string, Record<string, Record<string, string>>>} */
      const manifest = {};

      for (const rule of MICROCMS_ASSET_RULES) {
        const listResult = await fetchAllListContents(domain, apiKey, rule.endpoint, {
          fields: rule.listFields.join(","),
          orders: "system:default",
        });
        if (!listResult.ok) {
          console.warn(
            "[download-microcms-assets] list failed:",
            rule.key,
            listResult.status
          );
          continue;
        }

        const contents = listResult.contents;

        if (!manifest[rule.key]) manifest[rule.key] = {};

        for (const img of rule.images) {
          const segment = img.pathSegment ?? safePathSegment(img.field);
          await fsPromises.mkdir(path.join(generatedRoot, rule.key, segment), {
            recursive: true,
          });
        }

        for (const item of contents) {
          const id = item?.id;
          if (!id) continue;
          if (!manifest[rule.key][id]) manifest[rule.key][id] = {};

          for (const img of rule.images) {
            const remoteUrl = item?.[img.field]?.url;
            if (!remoteUrl) continue;

            const segment = img.pathSegment ?? safePathSegment(img.field);
            const outDir = path.join(generatedRoot, rule.key, segment);

            try {
              const imgRes = await fetch(remoteUrl);
              if (!imgRes.ok) {
                console.warn(
                  "[download-microcms-assets] image fetch failed:",
                  rule.key,
                  id,
                  img.field,
                  imgRes.status
                );
                continue;
              }
              const buf = Buffer.from(await imgRes.arrayBuffer());
              const ext = guessExt(remoteUrl, imgRes.headers.get("content-type"));
              const fileName = `${id}${ext}`;
              const filePath = path.join(outDir, fileName);
              await fsPromises.writeFile(filePath, buf);
              const publicPath = `/_generated/${rule.key}/${segment}/${fileName}`;
              manifest[rule.key][id][img.field] = publicPath;
            } catch (e) {
              console.warn(
                "[download-microcms-assets] download error:",
                rule.key,
                id,
                img.field,
                e
              );
            }
          }
        }
      }

      await fsPromises.mkdir(path.dirname(manifestPath), { recursive: true });
      await fsPromises.writeFile(
        manifestPath,
        `${JSON.stringify(manifest, null, 2)}\n`,
        "utf8"
      );

      const count = countManifestPaths(manifest);
      console.info(
        "[download-microcms-assets] wrote manifest and",
        count,
        "image file(s) under public/_generated/"
      );
      microCMSAssetsDownloadDone = true;
    },
  };
}

/** @param {string} field */
function safePathSegment(field) {
  return String(field).replace(/[^\w-]+/g, "-");
}

/**
 * @param {string} remoteUrl
 * @param {string | null} contentType
 */
function guessExt(remoteUrl, contentType) {
  try {
    const pathname = new URL(remoteUrl).pathname;
    const ext = path.extname(pathname);
    if (ext && ext.length <= 6) return ext;
  } catch {
    /* ignore */
  }
  if (!contentType) return ".bin";
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return ".jpg";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("svg")) return ".svg";
  return ".bin";
}

/** @param {Record<string, Record<string, Record<string, string>>>} manifest */
function countManifestPaths(manifest) {
  let n = 0;
  for (const byId of Object.values(manifest)) {
    for (const byField of Object.values(byId)) {
      n += Object.keys(byField).length;
    }
  }
  return n;
}
