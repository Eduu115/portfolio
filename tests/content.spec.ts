import { expect, test, type Page } from '@playwright/test';
import { existsSync } from 'node:fs';
import { EMAIL, GITHUB, LINKEDIN, LINKS } from '../src/config';
import { ui } from '../src/i18n/ui';

// Plan 15.2, content.spec: runs once (desktop-dark) over the 4 pages in both languages.
const pages = [
  { path: '/', lang: 'en' },
  { path: '/work/api-arena', lang: 'en' },
  { path: '/es', lang: 'es' },
  { path: '/es/work/api-arena', lang: 'es' },
] as const;
const external = new Set<string>([LINKEDIN, GITHUB, `mailto:${EMAIL}`, ...Object.values(LINKS)]);
const once = (name: string) => test.skip(name !== 'desktop-dark', 'content checks run once');

/** Every string a visitor or assistive tech can get: visible text, attributes, and the explorer island's props. */
const allText = (page: Page) =>
  page.evaluate(() => {
    const attrs = [...document.querySelectorAll('*')].flatMap((el) => [...el.attributes].map((a) => a.value));
    return [document.title, document.body.innerText, document.body.textContent ?? "", ...attrs].join('\n');
  });

for (const { path, lang } of pages) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }, info) => {
      once(info.project.name);
      await page.goto(path);
    });

    test('no dashes, phone, attribution, banned figures', async ({ page }) => {
      const text = await page.evaluate(() => document.body.innerText);
      expect(text).not.toMatch(/[–—]/);
      const lower = text.toLowerCase();
      for (const s of ['+34', 'generated with', 'co-authored', '30k', 'lines of', 'líneas de', '9 services', 'nine services', '9 servicios', 'nueve servicios'])
        expect(lower, s).not.toContain(s);
      const roles = page.locator('#experience li');
      if ((await roles.count()) > 1) expect((await roles.nth(1).innerText()).toLowerCase()).not.toContain('power bi');
    });

    test('no banned terms from BANNED_TERMS', async ({ page }) => {
      const raw = process.env.BANNED_TERMS;
      expect(raw, 'BANNED_TERMS is not set: add it to .env.local (comma-separated, never committed) or as a CI secret (plan P9)').toBeTruthy();
      const terms = raw!.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      const text = (await allText(page)).toLowerCase();
      for (const term of terms) expect(text.includes(term), 'a banned term appears on the page').toBe(false);
    });

    test('lang, hreflang and a single h1', async ({ page }) => {
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      for (const h of ['en', 'es', 'x-default']) await expect(page.locator(`link[rel="alternate"][hreflang="${h}"]`)).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);
    });

    test('internal links answer 200, external links come from config.ts', async ({ page, request }) => {
      const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
      for (const href of new Set(hrefs)) {
        if (href.startsWith('#')) continue;
        if (href.startsWith('/')) {
          const url = href.split('#')[0];
          if (url.startsWith('/cv/')) {
            if (!existsSync(`public${url}`)) console.warn(`warning: ${url} is missing (plan P2)`);
            continue;
          }
          expect((await request.get(url)).status(), url).toBe(200);
        } else {
          expect(external.has(href), href).toBe(true);
        }
      }
    });
  });
}

test('every Appendix A text of each language is on its pages', async ({ page }, info) => {
  once(info.project.name);
  // Texts that only live on the 404 page or in head metadata are checked there.
  for (const lang of ['en', 'es'] as const) {
    let text = '';
    for (const p of pages.filter((p) => p.lang === lang)) {
      await page.goto(p.path);
      text += await allText(page);
      text += await page.locator('head').evaluate((h) => [...h.querySelectorAll('meta')].map((m) => m.content).join('\n'));
    }
    await page.goto(lang === 'en' ? '/404' : '/es/404');
    text += await allText(page);
    const missing = Object.entries(ui[lang]).filter(([, v]) => !text.includes(v)).map(([k]) => k);
    expect(missing, `${lang}: keys not found`).toEqual([]);
  }
});
