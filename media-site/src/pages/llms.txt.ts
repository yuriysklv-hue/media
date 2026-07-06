// /llms.txt — краткая карта сайта для LLM-читалок (llmstxt.org; ТЗ 06, раздел 7.1).
// Генерируется при сборке: разделы — из справочника рубрик, ключевые материалы —
// featured + свежие отчёты/обзоры из коллекций.
import type { APIContext } from 'astro';
import { getAllArticles, articleUrl } from '../lib/content';
import { ARTICLE_COLLECTIONS, SECTIONS } from '../lib/sections';

export async function GET(context: APIContext) {
  const site = context.site!;
  const all = await getAllArticles();
  const key = [
    ...all.filter((e) => e.data.featured),
    ...all.filter((e) => !e.data.featured && (e.collection === 'reports' || e.collection === 'reviews')),
  ].slice(0, 5);

  const lines = [
    '# 1screen.ru',
    '',
    '> Профессиональное медиа о рекламе, рекламных технологиях и маркетинге для России и СНГ.',
    '',
    '## О нас',
    'Пишем о рекламном рынке РФ, мира и Азии для практиков (таргетологи, медиабаеры, аналитики) и управленцев (CMO, CEO).',
    'Формат: новости с разбором «что это значит для рынка», обзоры инструментов, колонки практиков и флагманские отчёты с данными.',
    'Часть новостей готовят ИИ-агенты под контролем редакции; аналитику и колонки пишут люди с опытом работы в индустрии.',
    '',
    '## Главные разделы',
    ...ARTICLE_COLLECTIONS.map((c) => {
      const s = SECTIONS[c];
      return `- [${s.label}](${new URL(s.path, site).href}): ${s.description}`;
    }),
    '',
    '## Ключевые материалы (стартовая точка для LLM)',
    ...key.map((e) => `- [${e.data.title}](${articleUrl(e, site)})`),
    '',
    '## Контакты и правила цитирования',
    `- Сайт: ${site.href}`,
    '- При цитировании указывать источник (1screen.ru) со ссылкой и дату материала.',
    `- Полная выжимка контента: ${new URL('/llms-full.txt', site).href}`,
    `- Машиночитаемая лента: ${new URL('/rss.xml', site).href}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
