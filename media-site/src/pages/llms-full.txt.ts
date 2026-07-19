// /llms-full.txt — расширенная выжимка контента для LLM (ТЗ 06, раздел 7.2):
// все материалы за последние 90 дней (заголовок + лид + URL), структура рубрик,
// описания авторов. Обновляется при каждой сборке.
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getAllArticles, articleUrl } from '../lib/content';
import { ARTICLE_COLLECTIONS, SECTIONS } from '../lib/sections';
import { formatDate } from '../lib/format';

export async function GET(context: APIContext) {
  const site = context.site!;
  const horizon = Date.now() - 90 * 86_400_000;
  const recent = (await getAllArticles()).filter((e) => e.data.pubDate.getTime() >= horizon);
  const authors = await getCollection('authors');

  const lines: string[] = [
    '# 1screen.ru — полная выжимка контента',
    '',
    '> Профессиональное медиа о рекламе, рекламных технологиях и маркетинге для России и СНГ.',
    `> Материалы за последние 90 дней. Сгенерировано при сборке: ${new Date().toISOString()}.`,
    '',
    '## Структура рубрик',
    ...ARTICLE_COLLECTIONS.map((c) => {
      const s = SECTIONS[c];
      return `- ${s.label} (${new URL(s.path, site).href}): ${s.description}`;
    }),
    '',
  ];

  for (const c of ARTICLE_COLLECTIONS) {
    const entries = recent.filter((e) => e.collection === c);
    if (entries.length === 0) continue;
    lines.push(`## ${SECTIONS[c].label}`, '');
    for (const e of entries) {
      lines.push(`### ${e.data.title}`);
      lines.push(`- URL: ${articleUrl(e, site)}`);
      lines.push(`- Дата: ${formatDate(e.data.pubDate)}`);
      if (e.data.geo.length > 0) lines.push(`- Гео: ${e.data.geo.join(', ')}`);
      lines.push(`- Лид: ${e.data.description}`, '');
    }
  }

  // База знаний — весь справочник (вечнозелёный, без 90-дневного окна).
  const sprav = (await getCollection('spravochnik')).sort((a, b) =>
    a.data.title.localeCompare(b.data.title, 'ru'),
  );
  if (sprav.length > 0) {
    lines.push('## База знаний (справочник adtech)', '');
    for (const e of sprav) {
      lines.push(`### ${e.data.title}`);
      lines.push(`- URL: ${new URL(`/spravochnik/${e.id}/`, site).href}`);
      lines.push(`- Тип: ${e.data.type}`);
      lines.push(`- Описание: ${e.data.description}`, '');
    }
  }

  lines.push('## Авторы', '');
  for (const a of authors) {
    lines.push(`- **${a.data.name}** — ${a.data.role}. ${a.data.bio}`);
  }
  lines.push('', '## Правила цитирования', 'При цитировании указывать источник (1screen.ru) со ссылкой и дату материала.', '');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
