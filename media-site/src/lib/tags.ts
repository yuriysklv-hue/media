// Теги материалов: транслитерация в URL-slug, группировка и порог индексации.
// Модуль ЧИСТЫЙ (без `astro:content`) — его импортируют и .astro-страницы,
// и astro.config.mjs (для фильтра sitemap). Данные о материалах передаются
// извне (getCollection в рантайме / чтение фронт-маттера с диска в конфиге).

// Тег индексируется (index,follow + попадает в sitemap) только при таком числе
// материалов; меньше — noindex,follow (защита от thin-content). Порог — здесь.
export const TAG_INDEX_THRESHOLD = 3;

// Кириллица → латиница (упрощённый практический транслит для URL).
const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'shch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

/** Тег → URL-slug: lowercase, транслит кириллицы, kebab-case, только [a-z0-9-]. */
export function tagSlug(tag: string): string {
  let out = '';
  for (const ch of tag.toLowerCase()) out += ch in TRANSLIT ? TRANSLIT[ch] : ch;
  return out.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Минимальная форма записи материала, нужная для подсчёта тегов. */
export interface TagCountable {
  data: { tags?: string[] };
}

export interface TagInfo<E extends TagCountable> {
  slug: string;
  label: string;
  count: number;
  indexable: boolean;
  entries: E[];
}

/**
 * Собирает индекс тегов по списку материалов. Группировка — по slug
 * (кейс-нечувствительно: `Google` и `google` → один тег `google`). Подпись —
 * самое частое исходное написание в группе. Дубли тега внутри одной записи
 * не удваивают счётчик. Сортировка: по убыванию количества, затем по slug.
 */
export function buildTagIndex<E extends TagCountable>(entries: E[]): TagInfo<E>[] {
  const groups = new Map<string, { labels: Map<string, number>; entries: E[] }>();

  for (const entry of entries) {
    const seen = new Set<string>();
    for (const raw of entry.data.tags ?? []) {
      const slug = tagSlug(raw);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      let group = groups.get(slug);
      if (!group) {
        group = { labels: new Map(), entries: [] };
        groups.set(slug, group);
      }
      group.labels.set(raw, (group.labels.get(raw) ?? 0) + 1);
      group.entries.push(entry);
    }
  }

  const index: TagInfo<E>[] = [];
  for (const [slug, group] of groups) {
    let label = slug;
    let best = -1;
    for (const [candidate, freq] of group.labels) {
      if (freq > best) {
        best = freq;
        label = candidate;
      }
    }
    const count = group.entries.length;
    index.push({ slug, label, count, indexable: count >= TAG_INDEX_THRESHOLD, entries: group.entries });
  }

  index.sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
  return index;
}
