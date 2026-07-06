// RSS-фид: 30 свежих материалов всех рубрик. На него указывает
// <link rel="alternate"> в BaseLayout и иконка RSS в футере.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllArticles } from '../lib/content';
import { SECTIONS } from '../lib/sections';

export async function GET(context: APIContext) {
  const items = (await getAllArticles()).slice(0, 30);
  return rss({
    title: '1screen.ru — медиа о рекламе и маркетинге',
    description:
      'Профессиональное медиа о рекламе, рекламных технологиях и маркетинге для России и СНГ. Новости, обзоры и аналитика: РФ, мир, Азия.',
    site: context.site!,
    items: items.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: `/article/${entry.id}/`,
      categories: [SECTIONS[entry.collection].label, entry.data.category],
    })),
    customData: '<language>ru</language>',
  });
}
