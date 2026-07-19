// @ts-check
import { defineConfig } from 'astro/config';
import { downloadMicroCMSAssetsPlugin } from './integrations/vite-download-microcms-assets.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://chono-piano.com',
  trailingSlash: 'always',
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    plugins: [downloadMicroCMSAssetsPlugin()],
  },
});
