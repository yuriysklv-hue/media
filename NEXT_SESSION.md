# Задача на следующую сессию — `media-site`, Итерация 2

> Хендофф от сессии 06.07.2026. Полный статус — в `CLAUDE.md`, раздел «Статус запуска». Этот файл — конкретная задача на следующий заход.

## Контекст (что уже сделано)

- Домен `1screen.ru` зарегистрирован (reg.ru), проверен — чистый.
- Сайт `media-site/` (подпапка этого репо) на **Astro 5 + Tailwind 4 + Inter** (self-hosted).
- Собрана и задеплоена **главная** — перенос `mockups/1screen-mockup-minimal.html` (палитра «Петроль», sans, text-only). Контент демонстрационный.
- Деплой: **Timeweb Cloud** (App Platform, тип «Другой»), автосборка из `main` (команда `npm ci && npm run build`, каталог проекта `media-site`, публикация `dist`). Публично на `https://1screen.ru` (авто-SSL). **Переехали с Vercel** — тот в РФ блокируется ТСПУ/РКН. DNS в reg.ru: `A @ → 92.246.76.92`.
- `src/styles/global.css` уже содержит **всю** дизайн-систему из макета, включая стили страницы материала (`.article-*`, `.callout`, `.statblock`, `.cmp-table`, `.source-box`, `.tag-list`, `.author-bio`, `.related`, `.read-progress`). Переносить CSS заново не нужно — только разметку.

## Цель сессии

Контент-модель + вторая ключевая страница (материал) + SEO-каркас. Ориентиры: `09_Итерация_1_каркас_сайта.md`, `08_Итерации_разработки.md`, `06_SEO_GEO_и_AI-разметка.md` — **но канон дизайна = минимал-макет и `CLAUDE.md`**, не газетный вариант.

### 1. Content Collections — `src/content/config.ts`
Коллекции: `news`, `digest`, `reviews`, `columns`, `reports`, `authors`.
Фронт-маттер материалов: `title`, `description` (≤160), `pubDate`, `type`, `category`, `geo[]` (`РФ`/`МИР`/`АЗИЯ`), `tags[]`, `author?`, `featured` (bool), `cover?`, `source?`. Категории — **без цветокодировки** (только навигация).

### 2. Страница материала — `src/pages/article/[...slug].astro`
Перенос секции `#view-article` из минимал-макета (в макете разметка уже собрана). Структура: хлебные крошки → eyebrow (категория + гео) → H1 → лид → мета с автором и кнопками шаринга → тело (колонка `--measure` = 680px) → `AuthorBio` → «Читайте также» (`RelatedList`, 3 карточки) → подписка. Сверху — прогресс-бар чтения (`.read-progress`, `body.reading`; логика в макете, строки ~613–643).
Спец-блоки тела оформить как **MDX-компоненты**: `Callout`, `StatBlock`, сравнительная таблица (`.cmp-wrap`/`.cmp-table` в `overflow-x:auto`), `SourceBox`, `TagList`. Стили — уже в `global.css`.

### 3. Тестовый контент (3 файла)
- `src/content/columns/zachem-my-zapuskaem-media-pro-adtech.md` — колонка основателя;
- `src/content/news/yandex-native-rsya-2026.md` — новость (текст из макета годится);
- `src/content/authors/y-sokolov.md` — профиль (name, role, bio, соцссылки).

### 4. Ленты рубрик
`pages/news/index.astro` и аналоги для `/digest`, `/reviews`, `/columns`, `/reports` — списки `ArticleListItem` по типу коллекции.

### 5. SEO-каркас
`@astrojs/sitemap` (site уже `https://1screen.ru` в `astro.config.mjs`), `public/robots.txt`, schema.org `NewsArticle` (JSON-LD) в шаблоне материала. Ориентир — `06_SEO_GEO_и_AI-разметка.md`.

### 6. Оживить главную
Заменить демо-массивы в `index.astro` на данные из коллекций (`getCollection`), сортировка по `pubDate`.

## Подводные камни

- **Канон — `mockups/1screen-mockup-minimal.html`**, НЕ `site-mockup.html` (направление сменено 05.07.2026). Шрифт — **Inter**, не Source Serif (ТЗ 09 писался под старый газетный макет — игнорировать в пользу минимала).
- Всё в подпапке `media-site/`. Проверка: `cd media-site && npm run build`. `dig` недоступен; Playwright глобально в `/opt/node22/lib/node_modules` (import через default export: `const { chromium } = pkg`).
- MDX — поставить `@astrojs/mdx`, если используем компоненты в теле статьи.

## Критерий приёмки

- `npm run build` без ошибок, ноль console-ошибок;
- страница материала визуально совпадает с макетом (спец-блоки, прогресс-бар, светлая/тёмная тема);
- тестовые `.md` проходят схему коллекций;
- генерируются `sitemap.xml` и `robots.txt`; в материале валидный JSON-LD `NewsArticle`;
- главная показывает реальные материалы из коллекций.
