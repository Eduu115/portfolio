import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const REF = 'docs/design/reference/screens/';

/** Compares `actual` with the rows [refY, refY + actual.height) of a reference screen. Writes a diff on failure. */
function diffRatio(actual: Buffer, ref: string, refY: number, name: string, max: number) {
  const a = PNG.sync.read(actual);
  const r = PNG.sync.read(readFileSync(REF + ref));
  const { width, height } = a;
  const crop = new PNG({ width, height });
  PNG.bitblt(r, crop, 0, refY, width, height, 0, 0);
  const diff = new PNG({ width, height });
  const ratio = pixelmatch(a.data, crop.data, diff.data, width, height, { threshold: 0.15 }) / (width * height);
  console.log(`${name}: ${(ratio * 100).toFixed(2)}% different pixels`);
  if (ratio > max) {
    mkdirSync('test-results', { recursive: true });
    writeFileSync(`test-results/${name}-diff.png`, PNG.sync.write(diff));
    writeFileSync(`test-results/${name}-actual.png`, actual);
  }
  return ratio;
}

async function open(page: Page, path = '/') {
  await page.goto(path);
  // Lazy images below the fold would be blank in a full-page capture.
  await page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = [...document.images];
    imgs.forEach((img) => (img.loading = 'eager'));
    await Promise.all(imgs.map((img) => img.decode().catch(() => {})));
  });
}

/** Full-page comparison: height difference <= 24px and different pixels <= max over the common height. */
async function fullPage(page: Page, ref: string, name: string, max: number) {
  const shot = PNG.sync.read(await page.screenshot({ fullPage: true }));
  const r = PNG.sync.read(readFileSync(REF + ref));
  const height = Math.min(shot.height, r.height);
  console.log(`${name}: page ${shot.height}px, reference ${r.height}px`);
  const top = new PNG({ width: shot.width, height });
  PNG.bitblt(shot, top, 0, 0, shot.width, height, 0, 0);
  expect(Math.abs(shot.height - r.height)).toBeLessThanOrEqual(24);
  expect(diffRatio(PNG.sync.write(top), ref, 0, name, max)).toBeLessThanOrEqual(max);
}

const header = {
  'desktop-dark': 'home-desktop-dark-1440.png',
  'mobile-dark': 'home-mobile-dark-390.png',
  'desktop-light': 'home-desktop-light-1440-hero-about.png',
} as Record<string, string>;

const footer = {
  'desktop-dark': 'home-desktop-dark-1440.png',
  'mobile-dark': 'home-mobile-dark-390.png',
} as Record<string, string>;

test('home matches the reference (full page)', async ({ page }, info) => {
  const ref = { 'desktop-dark': 'home-desktop-dark-1440.png', 'mobile-dark': 'home-mobile-dark-390.png' }[info.project.name];
  test.skip(!ref, 'no full-page reference for this project');
  await open(page);
  await fullPage(page, ref!, `home-${info.project.name}`, info.project.name === 'mobile-dark' ? 0.03 : 0.02);
});

test('light home matches the reference (0 to 1386px)', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-light', 'light only');
  await open(page);
  const shot = await page.screenshot({ fullPage: true, clip: { x: 0, y: 0, width: 1440, height: 1386 } });
  expect(diffRatio(shot, 'home-desktop-light-1440-hero-about.png', 0, 'home-light', 0.02)).toBeLessThanOrEqual(0.02);
});

test('header matches the reference', async ({ page }, info) => {
  const ref = header[info.project.name];
  await open(page);
  const box = (await page.locator('header').boundingBox())!;
  const shot = await page.screenshot({ clip: { x: 0, y: 0, width: box.width, height: box.height } });
  expect(diffRatio(shot, ref, 0, `header-${info.project.name}`, 0.01)).toBeLessThanOrEqual(0.01);
});

test('footer matches the reference', async ({ page }, info) => {
  const ref = footer[info.project.name];
  test.skip(!ref, 'no footer reference for this project');
  await open(page);
  // From the footer's top rule to the end of the page, aligned with the end of the reference page
  // (whole pixels, so a fractional footer height cannot shift the rule by one row).
  const top = Math.floor(await page.locator('footer > div').evaluate((el) => el.getBoundingClientRect().top + scrollY));
  const end = await page.evaluate(() => document.documentElement.scrollHeight);
  const width = page.viewportSize()!.width;
  const shot = await page.screenshot({ fullPage: true, clip: { x: 0, y: top, width, height: end - top } });
  const refHeight = PNG.sync.read(readFileSync(REF + ref)).height;
  expect(diffRatio(shot, ref, refHeight - (end - top), `footer-${info.project.name}`, 0.01)).toBeLessThanOrEqual(0.01);
});

test('mobile menu matches the reference', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-dark', 'mobile only');
  // The reference shows "dark" chosen in the theme control.
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await open(page);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  const shot = await page.screenshot();
  expect(diffRatio(shot, 'mobile-menu-open-390.png', 0, 'mobile-menu', 0.03)).toBeLessThanOrEqual(0.03);
});
