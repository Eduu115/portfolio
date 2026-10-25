import { ui, type Lang } from './ui';
export const langs = ['en', 'es'] as const;
// Static builds with `format: 'file'` report pathnames like /index.html or /es.html.
export function pagePath(url: URL) { return url.pathname.replace(/(\/index)?\.html$/, '').replace(/\/$/, '') || '/'; }
export function getLang(url: URL): Lang { const p = pagePath(url); return p === '/es' || p.startsWith('/es/') ? 'es' : 'en'; }
export function t(lang: Lang) { return (key: keyof typeof ui.en): string => ui[lang][key] ?? ui.en[key]; }
export function localizePath(path: string, lang: Lang) { const clean = path.replace(/^\/es(?=\/|$)/, '') || '/'; return lang === 'es' ? (clean === '/' ? '/es' : `/es${clean}`) : clean; }
export function altPath(url: URL, lang: Lang) { return localizePath(pagePath(url), lang); }

// Type test: ui.es must have exactly the same keys as ui.en (fails `astro check` otherwise).
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
true satisfies Same<keyof typeof ui.en, keyof typeof ui.es>;
