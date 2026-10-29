import { expect, test } from '@playwright/test';

/*
 * WCAG 1.4.10 Reflow: a filter group flush with the page edge must not cause
 * horizontal scroll at 320px. renderIsolated's padding would hide an
 * overhanging chevron, so this renders with none.
 */
test.use({ viewport: { width: 320, height: 640 } });

test('reflow: a flush filter group fits a 320px viewport', async ({ page }) => {
  await page.goto('/');
  await page.setContent(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="/src/index.css">
<style>body { margin: 0; }</style></head><body>
<details class="govbb-filter-group">
  <summary class="govbb-filter-group__summary">Service type</summary>
</details></body></html>`,
    { waitUntil: 'networkidle' },
  );
  const { chevronRotate, scrollWidth } = await page.evaluate(() => ({
    // Proves the chevron rendered, so a missing stylesheet can't pass.
    chevronRotate: getComputedStyle(
      document.querySelector('summary')!,
      '::after',
    ).rotate,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(chevronRotate).toBe('135deg');
  expect(scrollWidth).toBe(320);
});
