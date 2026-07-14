// @ts-check
import { fileURLToPath } from 'node:url';
import { globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { buildTagIndex } from './src/lib/tags.ts';

const SITE = 'https://1screen.ru';

// Теги ниже порога индексации отдаются под noindex и НЕ должны попадать в
// sitemap. getCollection в конфиге недоступен, поэтому считаем теги прямо по
// фронт-маттеру на диске той же функцией buildTagIndex, что и страницы.
const root = fileURLToPath(new URL('.', import.meta.url));
const contentFiles = [
  ...globSync('src/content/**/*.md', { cwd: root }),
  ...globSync('src/content/**/*.mdx', { cwd: root }),
].filter((f) => !f.includes('authors'));

const contentEntries = contentFiles.map((f) => {
  const raw = readFileSync(join(root, f), 'utf-8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = match ? yaml.load(match[1]) : null;
  const tags = data && typeof data === 'object' && Array.isArray(/** @type {any} */ (data).tags)
    ? /** @type {any} */ (data).tags
    : [];
  return { data: { tags } };
});

// Нормализуем URL без хвостового слэша — sitemap может отдавать со слэшем.
const noNindex = (u) => u.replace(/\/$/, '');
const noindexTagUrls = new Set(
  buildTagIndex(contentEntries)
    .filter((t) => !t.indexable)
    .map((t) => noNindex(`${SITE}/tag/${t.slug}`)),
);

// https://astro.build/config
export default defineConfig({
  // Продакшн-домен. Используется для canonical, og:url, sitemap.
  site: SITE,
  integrations: [
    mdx(),
    sitemap({
      // Исключаем тег-страницы ниже порога индексации (у них noindex).
      filter: (page) => !noindexTagUrls.has(noNindex(page)),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
