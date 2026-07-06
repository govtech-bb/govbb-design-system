import { defineConfig, devices } from '@playwright/test';

/*
 * Visual regression over the frontend playground (packages/frontend). Each
 * playground <section> is rendered in isolation and screenshotted against a
 * committed baseline in ./screenshots; interaction states get their own
 * forced-pseudo-class baselines. A PR that changes how a component renders
 * fails until the baselines are updated (pnpm test:visual --update-snapshots).
 * Baselines are per-platform (-darwin/-linux suffixes): darwin ones serve
 * local runs, linux ones serve CI — regenerate the linux set with the
 * update-visual-baselines workflow.
 */
export default defineConfig({
  testDir: '.',
  snapshotPathTemplate:
    '{testDir}/screenshots/{arg}-{projectName}-{platform}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:5199',
    viewport: { width: 1000, height: 800 },
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command:
      'pnpm --filter @govtech-bb/frontend exec vite --port 5199 --strictPort',
    url: 'http://localhost:5199',
    reuseExistingServer: !process.env.CI,
  },
});
