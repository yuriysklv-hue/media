// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Продакшн-домен. Используется для canonical, og:url, sitemap (подключим позже).
  site: 'https://1screen.ru',
  vite: {
    plugins: [tailwindcss()],
  },
});
