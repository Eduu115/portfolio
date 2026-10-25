import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://example.invalid', // P1
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  compressHTML: true,
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en-GB', es: 'es-ES' } } }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Astro builds with target esnext, which makes the CSS minifier drop -webkit-backdrop-filter (Safari < 18).
    build: { cssTarget: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'] },
  },
});
