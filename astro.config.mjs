// @ts-check
import { defineConfig } from 'astro/config';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { resolve, normalize } from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// GitHub Pages: the deploy workflow sets SITE and BASE (e.g. "/my-repo").
// For a <user>.github.io repo BASE is "/".
const site = process.env.SITE ?? 'https://tomjnet.github.io';
const base = process.env.BASE ?? '/';

// Dev only: serve ./website-info at /__content/ so images in local posts load
// without the real website-info repo (see src/lib/content.ts).
/** @returns {import('vite').Plugin} */
function localContent() {
  const root = resolve('website-info');
  return {
    name: 'local-content',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__content', (req, res, next) => {
        const path = normalize(decodeURIComponent((req.url ?? '/').split('?')[0]));
        const file = resolve(root, '.' + path);
        if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) return next();
        const types = { '.json': 'application/json', '.md': 'text/markdown; charset=utf-8', '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg' };
        const type = Object.entries(types).find(([ext]) => file.endsWith(ext))?.[1];
        if (type) res.setHeader('Content-Type', type);
        createReadStream(file).pipe(res);
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site,
  base,
  // The old /posts/view/?p= page only redirects, so keep it out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes('/posts/view/') })],
  vite: {
    plugins: [tailwindcss(), localContent()],
  },
});
