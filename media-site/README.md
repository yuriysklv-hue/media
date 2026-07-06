# media-site — сайт 1screen.ru

Медиа о рекламе и маркетинге. Статический сайт на **Astro 5 + Tailwind 4**, шрифт **Inter** (self-hosted через Fontsource, без CDN). Деплой — **Vercel** (автопубликация при пуше).

> Каркас Итерации 1: перенос канонического макета `mockups/1screen-mockup-minimal.html` (направление «тех/продукт минимал», палитра «Петроль» `#14636B`). Сейчас собрана **главная страница** на демо-контенте. Реальные материалы (Content Collections) и страница материала — в следующих итерациях.

## Локальный запуск

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # сборка в dist/
npm run preview  # предпросмотр собранного
```

Требуется Node 18+ (проверено на Node 22).

## Структура

```
media-site/
├── src/
│   ├── layouts/BaseLayout.astro   # <head> + SEO-мета, шрифт, шапка/футер, слот
│   ├── components/
│   │   ├── Header.astro           # sticky-шапка, логотип-локап, навигация, CTA
│   │   └── Footer.astro           # многоколоночный футер
│   ├── pages/index.astro          # главная (hero → лента+сайд-бар → мнения → подписка)
│   └── styles/global.css          # дизайн-система (токены + компоненты из макета)
├── astro.config.mjs               # site: https://1screen.ru, плагин Tailwind
└── package.json
```

## Дизайн-система

Токены (цвета, шрифты, сетка) — CSS-переменные в `src/styles/global.css`, источник истины по значениям — макет. Светлая/тёмная тема переключаются по `prefers-color-scheme`; предусмотрен ручной оверрайд через `data-theme` на `<html>` (переключатель добавим позже).

## Деплой на Vercel

Сайт лежит в подпапке `media-site/` репозитория. При импорте в Vercel:

1. **Framework Preset:** Astro (определится автоматически).
2. **Root Directory:** `media-site` — важно указать, т.к. проект не в корне репо.
3. Build Command `npm run build`, Output Directory `dist` — значения по умолчанию Astro.
4. После деплоя подключить домен `1screen.ru` (DNS-записи Vercel подскажет в разделе Domains).

Позже проект удобно вынести в отдельный репозиторий `media-site` (по ТЗ) — история сборки к тому моменту не понадобится.
