import { expect, test } from '@playwright/test';

/*
 * One baseline screenshot per playground section, named after its <h2>. The
 * section list is discovered at runtime, but the count is pinned so a section
 * added without a baseline (or a heading rename orphaning one) fails loudly
 * instead of silently shrinking coverage.
 */
const EXPECTED_SECTIONS = 22;

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

test('playground renders every section', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  const sections = page.locator('body > section');
  expect(await sections.count()).toBe(EXPECTED_SECTIONS);

  for (const section of await sections.all()) {
    const heading = await section.locator('h2').first().innerText();
    await expect(section).toHaveScreenshot(`${slug(heading)}.png`);
  }
});
