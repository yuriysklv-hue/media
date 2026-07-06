// Общие выборки контента для эндпоинтов (RSS, llms.txt) и страниц.
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { ARTICLE_COLLECTIONS, type ArticleCollection } from './sections';

export type ArticleEntry = CollectionEntry<ArticleCollection>;

/** Все материалы всех контентных коллекций, свежие первыми. */
export async function getAllArticles(): Promise<ArticleEntry[]> {
  const all = (await Promise.all(ARTICLE_COLLECTIONS.map((c) => getCollection(c)))).flat();
  return all.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Абсолютный URL материала. */
export function articleUrl(entry: ArticleEntry, site: URL | string = 'https://1screen.ru'): string {
  return new URL(`/article/${entry.id}/`, site).href;
}
