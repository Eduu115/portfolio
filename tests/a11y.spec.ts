import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Plan 15.2: the 4 pages in both themes, zero violations. Desktop projects cover the two themes.
for (const path of ['/', '/es', '/work/api-arena', '/es/work/api-arena']) {
  test(`no axe violations on ${path}`, async ({ page }, info) => {
    test.skip(info.project.name === 'mobile-dark', 'themes are covered by desktop-dark and desktop-light');
    await page.goto(path);
    if (path.includes('/work/')) {
      await page.locator('#flow-title').scrollIntoViewIfNeeded();
      await page.locator('astro-island:not([ssr])').waitFor({ state: 'attached' });
    }
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}
