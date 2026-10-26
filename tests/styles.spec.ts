import { expect, test, type Page } from '@playwright/test';

// Appendix B of the plan: computed-style assertions. Sizes within ±0.5px.
const style = (page: Page, sel: string, prop: string) =>
  page.locator(sel).first().evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);
const firstFamily = (v: string) => v.split(',')[0].trim();
const near = (v: string, px: number) => expect(Math.abs(parseFloat(v) - px)).toBeLessThanOrEqual(0.5);

test.describe('desktop-dark', () => {
  test.beforeEach(async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop-dark', 'desktop-dark only');
    await page.goto('/');
  });

  test('page, header and type', async ({ page }) => {
    expect(await style(page, 'body', 'background-color')).toBe('rgb(11, 12, 14)');
    expect(firstFamily(await style(page, 'body', 'font-family'))).toBe('"Archivo Variable"');
    near(await style(page, 'header', 'height'), 65);
    near(await style(page, '.hero-title', 'font-size'), 80);
    expect(await style(page, '.hero-title', 'font-weight')).toBe('800');
    expect(await style(page, '.hero-title', 'font-stretch')).toBe('75%');
    expect(await style(page, '.hero-title span', 'color')).toBe('rgb(255, 107, 26)');
    near(await style(page, '#about h2', 'font-size'), 56);
    near(await style(page, '#about .stat', 'font-size'), 96);
    expect(await style(page, '#about .stat', 'color')).toBe('rgb(255, 107, 26)');
    expect(firstFamily(await style(page, '.label', 'font-family'))).toBe('"Martian Mono Variable"');
    near(await style(page, '.label', 'font-size'), 12);
  });

  test('cards, buttons, rail, band and footer mark', async ({ page }) => {
    expect(await style(page, '#work article.card', 'padding')).toBe('40px');
    expect(await style(page, '#work article.card', 'border-radius')).toBe('12px');
    expect(await style(page, '#work article.card', 'background-color')).toBe('rgb(19, 21, 24)');
    const cta = '[data-testid="hero-cta"]';
    near(await style(page, cta, 'height'), 48);
    expect(await style(page, cta, 'border-radius')).toBe('8px');
    expect(await style(page, cta, 'background-color')).toBe('rgb(255, 107, 26)');
    expect(await style(page, cta, 'color')).toBe('rgb(11, 12, 14)');
    near(await style(page, '[data-testid="rail-node"]', 'width'), 12);
    near(await style(page, '[data-testid="rail-node"]', 'height'), 12);
    const band = '[data-testid="contact-band"]';
    expect(await style(page, band, 'background-color')).toBe('rgb(255, 107, 26)');
    expect(await style(page, band, 'border-radius')).toBe('16px');
    expect(await style(page, band, 'padding')).toBe('64px');
    expect(await style(page, '[data-testid="footer-mark"]', 'color')).toBe('rgb(36, 39, 44)');
    expect(await style(page, '[data-testid="footer-mark"]', 'font-stretch')).toBe('125%');
  });

  test('no shadows or gradients outside the allowed ones', async ({ page }) => {
    const offenders = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('body *')]
        .filter((el) => {
          const cs = getComputedStyle(el);
          const shadow = cs.boxShadow !== 'none' && !el.classList.contains('pulse');
          const gradient = cs.backgroundImage.includes('gradient') && !el.classList.contains('dots') && el.getClientRects().length > 0;
          return shadow || gradient;
        })
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`),
    );
    expect(offenders).toEqual([]);
  });
});

test.describe('pulse animation', () => {
  test.use({ reducedMotion: 'no-preference' });
  test('runs "travel" without reduced motion', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop-dark', 'desktop-dark only');
    await page.goto('/');
    expect(await style(page, '.pulse', 'animation-name')).toBe('travel');
  });
  test('hero entrance is staggered 0/60/120/180/200ms', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop-dark', 'desktop-dark only');
    await page.goto('/');
    const delays = await page.locator('#main section:first-child .rise').evaluateAll((els) => els.map((el) => getComputedStyle(el).animationDelay));
    expect(delays).toEqual(['0s', '0.06s', '0.12s', '0.18s', '0.2s']);
  });
});

test('mobile sizes', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-dark', 'mobile-dark only');
  await page.goto('/');
  near(await style(page, '.hero-title', 'font-size'), 46);
  near(await style(page, '#about .stat', 'font-size'), 64);
});

test('light theme colours', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-light', 'desktop-light only');
  await page.goto('/');
  expect(await style(page, 'body', 'background-color')).toBe('rgb(244, 245, 246)');
  expect(await style(page, '.hero-title span', 'color')).toBe('rgb(194, 65, 12)');
});

test('Spanish hero title size', async ({ page }, info) => {
  test.skip(info.project.name === 'desktop-light', 'dark projects only');
  await page.goto('/es');
  // Owner decision: desktop keeps the plan clamp (5.1vw = 73.44px at 1440), mobile uses 46px.
  near(await style(page, '.hero-title', 'font-size'), info.project.name === 'mobile-dark' ? 46 : 73.44);
});
