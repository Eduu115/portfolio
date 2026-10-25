import { expect, test } from '@playwright/test';

const desktop = (name: string) => name.startsWith('desktop');

test('theme toggle switches, persists and updates its label', async ({ page }, info) => {
  test.skip(!desktop(info.project.name), 'toggle lives in the desktop header');
  await page.goto('/');
  const html = page.locator('html');
  const toggle = page.locator('[data-theme-toggle]');
  const start = (await html.getAttribute('data-theme'))!;
  const next = start === 'dark' ? 'light' : 'dark';
  expect(start).toBe(info.project.name === 'desktop-light' ? 'light' : 'dark');

  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', next);
  await expect(toggle).toHaveAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute('content', next === 'dark' ? '#0B0C0E' : '#F4F5F6');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', next);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(next);
});

test('EN and ES go to the equivalent page', async ({ page }, info) => {
  test.skip(!desktop(info.project.name), 'switch lives in the desktop header');
  await page.goto('/');
  const group = page.getByRole('group', { name: 'Language' });
  await group.getByRole('link', { name: 'ES' }).click();
  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page.getByRole('group', { name: 'Idioma' }).getByRole('link', { name: 'EN' }).click();
  await expect(page).toHaveURL(/:4321\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('mobile menu opens, Esc closes, focus returns, page does not scroll', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-dark', 'mobile only');
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Open menu' });
  const dialog = page.locator('#mobile-menu');
  await button.click();
  await expect(dialog).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');

  await button.click();
  await page.getByRole('button', { name: 'Close menu' }).click();
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();

  await button.click();
  await dialog.getByRole('link', { name: 'About' }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/#about$/);
});

test('mobile menu theme control writes or clears the preference', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-dark', 'mobile only');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const group = page.getByRole('group', { name: 'Theme' });
  await expect(group.getByRole('button', { name: 'system' })).toHaveAttribute('aria-pressed', 'true');

  await group.getByRole('button', { name: 'light' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(group.getByRole('button', { name: 'light' })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');

  await group.getByRole('button', { name: 'system' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
});

test('menu closes when the window grows to desktop', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-dark', 'mobile only');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(page.locator('#mobile-menu')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
});

for (const width of [320, 390, 768, 1024, 1280, 1440]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop-dark', 'width sweep runs once');
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/es']) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  });
}

test('copy email writes to the clipboard and announces it', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'desktop-dark', 'runs once');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Copy email address' });
  await button.click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('serranotrenado.e@gmail.com');
  await expect(page.locator('#copy-status')).toHaveText('Email address copied');
  await expect(button).toHaveAttribute('data-state', 'copied');
  await expect(page.locator('#copy-status')).toHaveText('', { timeout: 3000 });
});

test('pulse is hidden with reduced motion', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-dark', 'runs once');
  await page.goto('/');
  expect(await page.locator('.pulse').evaluate((el) => getComputedStyle(el).display)).toBe('none');
});
