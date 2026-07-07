// Справочник тематических категорий материалов.
// Слаги — контракт с пайплайном агентов (media-agents, config/vocabulary.yaml):
// агенты пишут во фронт-маттер машинный слаг, сайт показывает русскую подпись.
// `editorial` — только для ручных материалов редакции, агенты его не используют.

export const CATEGORY_SLUGS = [
  'adtech-ru',
  'adtech-world',
  'adtech-asia',
  'market-news',
  'tools',
  'creative',
  'editorial',
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

// Все три adtech-категории показываются одинаково: гео-тег рядом с бейджем
// уже различает РФ/Мир/Азия, дублировать гео в подписи незачем.
export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  'adtech-ru': 'Adtech',
  'adtech-world': 'Adtech',
  'adtech-asia': 'Adtech',
  'market-news': 'Рынок и сделки',
  tools: 'Инструменты',
  creative: 'Креатив',
  editorial: 'От редакции',
};

/** Слаг категории → подпись для бейджей, RSS и schema.org. */
export function formatCategory(slug: string): string {
  return CATEGORY_LABELS[slug as CategorySlug] ?? slug;
}
