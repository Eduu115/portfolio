import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  use: { baseURL: 'http://localhost:4321', deviceScaleFactor: 1, reducedMotion: 'reduce' },
  webServer: { command: 'npm run build && npx astro preview --port 4321', port: 4321, reuseExistingServer: true },
  projects: [
    { name: 'desktop-dark', use: { viewport: { width: 1440, height: 900 }, colorScheme: 'dark' } },
    { name: 'mobile-dark', use: { viewport: { width: 390, height: 844 }, colorScheme: 'dark' } },
    { name: 'desktop-light', use: { viewport: { width: 1440, height: 900 }, colorScheme: 'light' } },
  ],
});
