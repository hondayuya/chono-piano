/**
 * 本番ビルド成果物から `/design/` を除外します。
 * 検証ページをビルドに含めたいときだけ `INCLUDE_DESIGN_PAGES=true` を指定してください。
 * `astro dev` では常に利用できます（このフックは build 時のみ）。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function excludeDesignPagesOnBuild() {
  return {
    name: 'exclude-design-pages-on-build',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (process.env.INCLUDE_DESIGN_PAGES === 'true') {
          logger.info(
            '[exclude-design] kept /design/ (INCLUDE_DESIGN_PAGES=true)',
          );
          return;
        }

        const outDir = fileURLToPath(dir);
        const designDir = path.join(outDir, 'design');
        try {
          await fs.access(designDir);
        } catch {
          return;
        }

        await fs.rm(designDir, { recursive: true, force: true });
        logger.info('[exclude-design] removed /design/ from build output');
      },
    },
  };
}
