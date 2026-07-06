import { expect, test } from '@playwright/test';
import { playgroundCases, renderIsolated } from './harness';

/*
 * One baseline per playground section, but rendered in isolation: the
 * section's markup is lifted out and screenshotted alone on a centered blank
 * page, so a baseline only changes when its own component changes. The
 * playground stays the single source of truth for the markup, and the pinned
 * count fails loudly when a section is added without a baseline (or a heading
 * rename orphans one).
 */
const EXPECTED_SECTIONS = 22;

test('every playground section renders in isolation', async ({ page }) => {
  const cases = await playgroundCases(page);
  expect(cases.length).toBe(EXPECTED_SECTIONS);

  for (const { slug, html, dark } of cases) {
    await renderIsolated(page, html, dark);
    // soft: collect every changed section in one run instead of stopping at
    // the first diff and masking the rest.
    await expect.soft(page).toHaveScreenshot(`${slug}.png`, { fullPage: true });
  }
});
