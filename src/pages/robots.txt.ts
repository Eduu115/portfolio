import type { APIRoute } from 'astro';

// Built from `site` (SITE_URL) so the sitemap line is valid before and after the real domain exists (plan P1).
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`);
