// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { tableLabels } from './src/lib/tableLabels.mjs';

// Environment gate: the site is noindex everywhere except an explicit
// production build. Deployed builds (production, staging) require SITE_URL so
// canonical URLs never point at localhost, and indexing can never be enabled
// by accident.
const env = process.env.PUBLIC_SITE_ENV ?? 'local';
const isProd = env === 'production';
const isDeployed = isProd || env === 'staging';
const site = process.env.SITE_URL;

if (isDeployed && !site) {
  throw new Error(`SITE_URL must be set for a ${env} build.`);
}
if (isProd && process.env.PUBLIC_NOINDEX === 'true') {
  throw new Error('Refusing to build production with PUBLIC_NOINDEX=true.');
}

// https://astro.build/config
export default defineConfig({
  site: site ?? 'http://localhost:4321',
  trailingSlash: 'always',
  // Merged pages (content strategy, 27 Sep 2026). A host adapter turns these
  // into real 301s; the static build emits meta-refresh stubs.
  redirects: {
    '/guides/client-onboarding/': '/guides/portal-data-model/',
    '/guides/portal-permissions/': '/guides/client-portal-launch/',
    '/compare/noloco-vs-softr-plus-fillout/': '/compare/softr-vs-noloco/',
  },
  vite: {
    plugins: [tailwindcss()]
  },

  // MDX tables get build-time column labels for the phone layout (src/lib/tableLabels.mjs).
  integrations: [mdx({ processor: satteri({ hastPlugins: [tableLabels] }) }), sitemap()]
});
