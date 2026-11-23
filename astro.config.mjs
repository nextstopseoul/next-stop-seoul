// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/site.config.mjs';

// PREVIEW=1 builds flat .html files with relative-safe links for the Claude preview.
const preview = process.env.PREVIEW === '1';

export default defineConfig({
  site: SITE.url,
  trailingSlash: preview ? 'ignore' : 'always',
  build: { format: preview ? 'file' : 'directory', assets: preview ? 'assets' : '_astro' },
  integrations: preview ? [] : [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
