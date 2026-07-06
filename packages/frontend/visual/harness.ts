import type { Page } from '@playwright/test';

/*
 * Renders a markup snippet alone on a blank, centered page (same framing as
 * the docs site's Example iframe). Baselines then capture only the component
 * under test — playground headings, neighbours, and section layout can change
 * without churning every screenshot.
 */
export async function renderIsolated(page: Page, html: string, dark = false) {
  // Establish the dev-server origin so the relative stylesheet link resolves.
  if (new URL(page.url()).protocol !== 'http:') await page.goto('/');
  await page.setContent(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="/src/index.css">
<style>
  html { color-scheme: light; }
  body {
    margin: 0;
    padding: 32px;
    box-sizing: border-box;
    min-height: 100vh;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    justify-content: center;
    font-family: var(--govbb-font-sans, system-ui, sans-serif);
    background: ${dark ? 'var(--govbb-color-interactive)' : '#fff'};
  }
</style></head><body>${html}</body></html>`,
    { waitUntil: 'networkidle' },
  );
  await page.evaluate(() => document.fonts.ready);
}

/** Pull each playground section's markup (sans heading) plus its dark flag. */
export async function playgroundCases(page: Page) {
  await page.goto('/');
  return page.$$eval('body > section', (sections) =>
    sections.map((section) => {
      const clone = section.cloneNode(true) as HTMLElement;
      clone.querySelector('h2')?.remove();
      return {
        slug: (section.querySelector('h2')?.textContent ?? '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, ''),
        html: clone.innerHTML,
        dark: section.classList.contains('dark'),
      };
    }),
  );
}
