import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://eduardoserranotrenado.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  compressHTML: true,
  // CSP with hashes for every inline script (plan 16.2). frame-ancestors cannot live in a <meta>, so nginx sends it.
  security: {
    csp: {
      directives: ["default-src 'self'", "img-src 'self' data:", "font-src 'self'", "connect-src 'self'", "base-uri 'self'", "form-action 'none'"],
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
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
