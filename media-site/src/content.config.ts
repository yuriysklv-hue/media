// Контент-модель 1screen.ru (Astro 5 Content Layer).
// Пять контентных коллекций с общей схемой материала + коллекция авторов.
// Тип материала (news/digest/reviews/columns/reports) следует из коллекции
// и во фронт-маттере не дублируется.
import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  // Лид/описание: идёт в <meta name="description"> и в карточки лент.
  description: z.string().max(160),
  pubDate: z.coerce.date(),
  category: z.string(),
  geo: z.array(z.enum(['РФ', 'МИР', 'АЗИЯ'])).default([]),
  tags: z.array(z.string()).default([]),
  author: reference('authors').optional(),
  featured: z.boolean().default(false),
  // Обложка допустима только у feature-материала, сейчас не используется (канон: text-only).
  cover: z.string().optional(),
  source: z.object({ title: z.string(), url: z.string().url() }).optional(),
  // Время чтения, минут. Пока проставляется вручную; позже — считать по тексту.
  readingTime: z.number().int().positive().optional(),
  // Короткие пункты для сайд-бара «Дайджест недели» (используется коллекцией digest).
  highlights: z.array(z.string()).optional(),
});

const makeArticleCollection = (dir: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${dir}` }),
    schema: articleSchema,
  });

const authors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    // Инициалы для аватара-кружка (картинок не используем).
    initials: z.string().max(3),
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
  authors,
};
