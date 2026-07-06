# Задача на следующую сессию — `media-site`, Итерация 3

> Хендофф от сессии 06.07.2026 (вечер). Полный статус — в `CLAUDE.md`, раздел «Статус запуска». Итерация 2 закрыта целиком; список демо-контента на замену — в `CONTENT_TODO.md`.

## Контекст (что уже сделано в Итерации 2)

- **Content Collections** (`src/content.config.ts`, Astro 5 glob-loader): `news`, `digest`, `reviews`, `columns`, `reports` (общая zod-схема: title, description ≤160, pubDate, category, geo[], tags[], author-reference, featured, source, readingTime, highlights) + `authors`.
- **Страница материала** `pages/article/[...slug].astro` — единый маршрут `/article/<slug>/` для всех пяти коллекций. Перенос из минимал-макета: крошки → eyebrow → H1 → лид → мета с автором и рабочим шарингом (TG/VK/копировать) → тело → source-box и теги из фронт-маттера → карточка автора → «Читайте также» → подписка. Прогресс-бар чтения работает (проп `reading` у BaseLayout).
- **MDX-компоненты** (`src/components/article/`): `Callout`, `StatBlock`, `CmpTable` (markdown-таблица внутри, стили через `:global`). Передаются в `<Content components={...}>` — импорты в mdx-файлах не нужны.
- **Ленты рубрик**: `/news`, `/digest`, `/reviews`, `/columns`, `/reports` (общий `layouts/SectionPage.astro` + `components/ArticleListItem.astro`). Навигация шапки и «Разделы» футера провязаны.
- **SEO**: `@astrojs/sitemap` (`sitemap-index.xml`), `public/robots.txt` (AI-боты allowed по ТЗ 06), JSON-LD `NewsArticle` + `og:type=article` на материалах.
- **Главная полностью динамическая**: hero = свежий `featured`, «Главное сейчас» = 3 новости (live-точка <3 ч), «Свежее» = 6 (news+reviews), дайджест из `highlights`, «Популярное» = 5 свежих (статистики пока нет), «Мнения» = 2 колонки.
- **Контент**: 13 демонстрационных материалов + профиль автора `authors/y-sokolov.md`. Даты форматируются по Москве (`src/lib/format.ts`), справочник рубрик — `src/lib/sections.ts`.
- Известные мелочи: список `.article-body ul` требовал явного `list-style` (Tailwind preflight) — уже починено; в минифицированном CSS `list-style:disc` выглядит как `list-style:outside` — это норма.

## Цель сессии (Итерация 3, адаптированная — деплой и дизайн уже есть)

Приоритет 1 — **контент**: помочь заменить демо-материалы реальными по `CONTENT_TODO.md` (проверка фактов, реальные источники, правка фронт-маттера). Если контент делает владелец руками — идти по технической части:

### 1. AI-доступность и SEO-добивка (ТЗ 06)
- `public/llms.txt` (+ по желанию `llms-full.txt`) — раздел 7 ТЗ 06;
- JSON-LD `BreadcrumbList` в шаблон материала (сейчас только `NewsArticle`);
- RSS-фид (`@astrojs/rss`) — на него уже указывает иконка RSS в футере;
- og-image: хотя бы статичная заглушка с вордмарком (сейчас `twitter:card=summary_large_image` без картинки).

### 2. Служебные страницы
- `/about` («О нас») — текст согласовать с владельцем;
- страница автора `/authors/y-sokolov` (ссылка «Все материалы автора →» сейчас `#`);
- решить судьбу пунктов футера «Реклама на сайте», «Редакция», «Контакты» (сделать или временно убрать).

### 3. Качество
- Lighthouse (astro preview + playwright/lighthouse) — цель ≥90 Performance;
- проверить фронт на реальном объёме контента (когда появятся длинные статьи);
- гео-ленты `/geo/rf|world|asia` — по желанию, футер «Гео» пока `#`.

## Подводные камни

- Канон дизайна — `mockups/1screen-mockup-minimal.html` и CLAUDE.md (НЕ ТЗ 02/09: там serif и старая палитра).
- Всё в `media-site/`; сборка `cd media-site && npm run build`. Рабочая ветка сессии ≠ `main`: деплой случится только после мержа PR в `main` (делает владелец).
- Playwright — глобально: `import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const { chromium } = pkg;`.
- `@astrojs/mdx` держать на `^4` (7.x требует Astro 7).
- Даты контента: `pubDate` указывать с `+03:00`; хелперы формата уже считают всё по Europe/Moscow.

## Критерий приёмки

- Build чистый, ноль console-ошибок;
- llms.txt / RSS / BreadcrumbList на месте (если делалась техчасть);
- реальные материалы проходят схему коллекций и корректно выглядят на главной, в рубриках и на странице материала.
