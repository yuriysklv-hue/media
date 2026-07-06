// Справочник контентных секций: коллекция → подпись и маршрут ленты.
// Используется в хлебных крошках, лентах рубрик и навигации.

export const ARTICLE_COLLECTIONS = ['news', 'digest', 'reviews', 'columns', 'reports'] as const;
export type ArticleCollection = (typeof ARTICLE_COLLECTIONS)[number];

export const SECTIONS: Record<ArticleCollection, { label: string; path: string; description: string }> = {
  news: {
    label: 'Новости',
    path: '/news',
    description: 'Новости рекламы и adtech: РФ, мир, Азия — коротко и с разбором, что это значит для рынка.',
  },
  digest: {
    label: 'Дайджесты',
    path: '/digest',
    description: 'Еженедельные дайджесты: главное, что сдвинуло рекламный рынок за неделю.',
  },
  reviews: {
    label: 'Обзоры',
    path: '/reviews',
    description: 'Обзоры инструментов и платформ для рекламы и маркетинга: сравнения, цены, практика.',
  },
  columns: {
    label: 'Мнения',
    path: '/columns',
    description: 'Колонки практиков рынка: личный опыт и позиции по спорным вопросам рекламы и adtech.',
  },
  reports: {
    label: 'Отчёты и исследования',
    path: '/reports',
    description: 'Флагманские отчёты и исследования рекламного рынка от редакции 1screen.ru.',
  },
};

/** Гео из фронт-маттера (РФ/МИР/АЗИЯ) → вид в теге, как в макете (РФ/Мир/Азия). */
export function formatGeo(geo: string): string {
  if (geo === 'РФ') return 'РФ';
  return geo.charAt(0) + geo.slice(1).toLowerCase();
}
