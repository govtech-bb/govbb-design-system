import { expect, test, type Page } from '@playwright/test';
import { playgroundCases, renderIsolated } from './harness';

/*
 * Interaction-state baselines: hover shadows and the shared keyboard focus
 * ring are most of this design system's behavioural CSS, and static shots
 * never exercise them. Each component is rendered in isolation (markup lifted
 * from its playground section), then CDP's CSS.forcePseudoState pins
 * :hover / :focus-visible deterministically — no real pointer or keyboard
 * events, so nothing races the screenshot.
 */
const STATES: Array<{ name: string; selector: string; state: string }> = [
  { name: 'button-primary-hover', selector: '.govbb-button', state: 'hover' },
  {
    name: 'button-primary-focus',
    selector: '.govbb-button',
    state: 'focus-visible',
  },
  {
    name: 'button-secondary-hover',
    selector: '.govbb-button--secondary',
    state: 'hover',
  },
  { name: 'checkbox-hover', selector: '.govbb-checkbox', state: 'hover' },
  {
    name: 'checkbox-focus',
    selector: '.govbb-checkbox',
    state: 'focus-visible',
  },
  { name: 'radio-hover', selector: '.govbb-radio', state: 'hover' },
  { name: 'radio-focus', selector: '.govbb-radio', state: 'focus-visible' },
  { name: 'input-hover', selector: '.govbb-input', state: 'hover' },
  { name: 'input-focus', selector: '.govbb-input', state: 'focus-visible' },
  { name: 'select-hover', selector: '.govbb-select', state: 'hover' },
  { name: 'select-focus', selector: '.govbb-select', state: 'focus-visible' },
  {
    name: 'textarea-focus',
    selector: '.govbb-textarea',
    state: 'focus-visible',
  },
  { name: 'link-hover', selector: '.govbb-link', state: 'hover' },
  { name: 'link-focus', selector: '.govbb-link', state: 'focus-visible' },
  {
    name: 'number-input-focus',
    selector: '.govbb-number-input',
    state: 'focus-visible',
  },
  {
    name: 'search-button-hover',
    selector: '.govbb-search__button',
    state: 'hover',
  },
  {
    name: 'file-upload-dropzone-hover',
    selector: '.govbb-file-upload__dropzone',
    state: 'hover',
  },
];

async function forcePseudoState(page: Page, selector: string, state: string) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument');
  const { nodeId } = await cdp.send('DOM.querySelector', {
    nodeId: root.nodeId,
    selector,
  });
  await cdp.send('CSS.forcePseudoState', {
    nodeId,
    forcedPseudoClasses: [state],
  });
  return () => cdp.detach();
}

for (const { name, selector, state } of STATES) {
  test(`state: ${name}`, async ({ page }) => {
    const cases = await playgroundCases(page);
    // Isolate the first playground section that contains the target element.
    const source = await page
      .locator(selector)
      .first()
      .locator('xpath=ancestor::section')
      .locator('h2')
      .innerText();
    const slug = source
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const found = cases.find((c) => c.slug === slug);
    if (!found) throw new Error(`no playground section found for ${selector}`);
    await renderIsolated(page, found.html, found.dark);
    const release = await forcePseudoState(page, selector, state);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
    await release();
  });
}
