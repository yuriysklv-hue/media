// Контент-модель 1screen.ru (Astro 5 Content Layer).
// Пять контентных коллекций с общей схемой материала + коллекция авторов.
// Тип материала (news/digest/reviews/columns/reports) следует из коллекции
// и во фронт-маттере не дублируется.
import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_SLUGS } from './lib/categories';

const articleSchema = z.object({
  title: z.string(),
  // Лид/описание: идёт в <meta name="description"> и в карточки лент.
  description: z.string().max(160),
  pubDate: z.coerce.date(),
  // Момент последнего обновления материала (update-flow пайплайна). Опционально:
  // отсутствует = материал не обновлялся. Идёт в JSON-LD dateModified (SEO —
  // Яндекс.Новости/Google News). Само значение проставляет media-agents.
  updatedDate: z.coerce.date().optional(),
  // Машинный слаг из справочника src/lib/categories.ts (контракт с media-agents).
  category: z.enum(CATEGORY_SLUGS),
  geo: z.array(z.enum(['РФ', 'МИР', 'АЗИЯ'])).default([]),
  tags: z.array(z.string()).default([]),
  author: reference('authors').optional(),
  featured: z.boolean().default(false),
  // Обложка допустима только у feature-материала, сейчас не используется (канон: text-only).
  cover: z.string().optional(),
  source: z.object({ title: z.string(), url: z.string().url() }).optional(),
  // Дополнительные источники многоисточникового материала (media-agents склеил
  // одну новость из нескольких фидов). Опционально: отсутствует/пусто = один
  // источник, рендерится только primary `source`, как раньше.
  additional_sources: z.array(z.object({ title: z.string(), url: z.string().url() })).optional(),
  // Время чтения, минут. Пока проставляется вручную; позже — считать по тексту.
  readingTime: z.number().int().positive().optional(),
  // Короткие пункты для сайд-бара «Дайджест недели» (используется коллекцией digest).
  highlights: z.array(z.string()).optional(),
  // Поля контракта с media-agents (имена — snake_case, как в ТЗ пайплайна).
  // Заголовок для анонсов в соцсетях; генерирует Enricher.
  social_title: z.string().max(100).optional(),
  // Количество источников недели (digest); пишет Digest Writer.
  sources_count: z.number().int().positive().optional(),
  // ISO-неделя дайджеста вида «2026-W28» (digest).
  week: z
    .string()
    .regex(/^\d{4}-W\d{2}$/)
    .optional(),
});

const makeArticleCollection = (dir: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${dir}` }),
    schema: articleSchema,
  });

// База знаний (Spravochnik) — второй, вечнозелёный раздел. Контракт с media-agents
// (src/spravochnik/writer.py): 4 типа материала, у каждого свой набор facts. Тип
// материала — в поле `type` (в отличие от контентных коллекций, где тип = имя
// коллекции). JSON-LD собирает сайт из facts+type (SpravochnikJsonLd.astro),
// LLM его не пишет. Поля `author` тут нет — материалы без авторства-персоны.
const spravBase = {
  title: z.string(),
  description: z.string().max(160),
  // Схема НЕ строгая: backend пишет `slug` во фронт-маттер, но id/роут Astro берёт
  // из имени файла — поле терпим как optional, лишние ключи zod отбрасывает.
  slug: z.string().optional(),
  pubDate: z.coerce.date(),
  // Момент обновления (задел под update-flow) — идёт в JSON-LD dateModified.
  updatedDate: z.coerce.date().optional(),
  aliases: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  // Slug'и других материалов справочника; несуществующие отбрасываются в роуте.
  related: z.array(z.string()).default([]),
};

const spravochnik = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/spravochnik' }),
  schema: z.discriminatedUnion('type', [
    z.object({
      ...spravBase,
      type: z.literal('company'),
      facts: z.object({
        founded: z.union([z.number(), z.string()]),
        founders: z.array(z.string()),
        hq: z.string(),
        official_url: z.string().url(),
        subtype: z.string().optional(),
        parent_organization: z.string().nullable().optional(),
        ticker: z.string().optional(),
        key_products: z.array(z.string()).default([]),
      }),
    }),
    z.object({
      ...spravBase,
      type: z.literal('technology'),
      facts: z.object({
        developer: z.string(),
        category: z.string(),
        official_url: z.string().url(),
        launch_date: z.union([z.number(), z.string()]).optional(),
        pricing_model: z.string().optional(),
        alternatives: z.array(z.string()).default([]),
      }),
    }),
    z.object({
      ...spravBase,
      type: z.literal('term'),
      facts: z.object({
        category: z.string(),
        definition: z.string(),
        aliases: z.array(z.string()).default([]),
      }),
    }),
    z.object({
      ...spravBase,
      type: z.literal('organization'),
      facts: z.object({
        full_name: z.string(),
        founded: z.union([z.number(), z.string()]),
        mission: z.string(),
        official_url: z.string().url(),
        key_initiatives: z.array(z.string()).default([]),
      }),
    }),
  ]),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    // Инициалы для аватара-кружка (картинок не используем).
    initials: z.string().max(3),
    // Редакционная служба (news-world и т.п.), а не человек:
    // в JSON-LD такой автор размечается как Organization.
    team: z.boolean().default(false),
    links: z
      .object({
        telegram: z.string().url().optional(),
        linkedin: z.string().url().optional(),
      })
      .optional(),
  }),
});

export const collections = {
  news: makeArticleCollection('news'),
  digest: makeArticleCollection('digest'),
  reviews: makeArticleCollection('reviews'),
  columns: makeArticleCollection('columns'),
  reports: makeArticleCollection('reports'),
  spravochnik,
  authors,
};
