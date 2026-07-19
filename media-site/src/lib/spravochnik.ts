// Справочник типов Базы знаний: тип → русская подпись бейджа, подпись группы
// на индексе и якорь секции. Единый источник для страниц, виджета и футера.
// Слаги типов — контракт с media-agents (src/spravochnik/writer.py).

export const SPRAV_TYPES = ['company', 'technology', 'term', 'organization'] as const;
export type SpravType = (typeof SPRAV_TYPES)[number];

// Бейдж типа на карточке/странице материала (единственное число).
export const SPRAV_TYPE_LABELS: Record<SpravType, string> = {
  company: 'Компания',
  technology: 'Технология',
  term: 'Термин',
  organization: 'Организация',
};

// Заголовок группы на индексе + якорь секции (для ссылок из футера).
export const SPRAV_GROUPS: Record<SpravType, { title: string; anchor: string }> = {
  company: { title: 'Компании', anchor: 'companies' },
  technology: { title: 'Технологии', anchor: 'technologies' },
  term: { title: 'Термины', anchor: 'terms' },
  organization: { title: 'Организации', anchor: 'organizations' },
};

export function formatSpravType(type: string): string {
  return SPRAV_TYPE_LABELS[type as SpravType] ?? type;
}
