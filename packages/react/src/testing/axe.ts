import axe from 'axe-core';
import { expect } from 'vitest';

/*
 * A/AA check for component tests against the WCAG version on the accessibility
 * page (apps/site/src/content/docs/accessibility.md).
 *
 * jsdom does no layout or painting. These rules need it, so they are off here
 * and need a real browser (#130): under jsdom they either cannot be computed
 * or report a result without measuring anything. Contrast is also a token
 * concern checked in the frontend package's design review.
 *
 * axe's experimental rules, such as label-content-name-mismatch (2.5.3), do not
 * run by tag. Turned on here they can only return incomplete, so they need a
 * real browser too.
 */
const NEEDS_A_REAL_BROWSER = [
  'color-contrast',
  'target-size',
  'avoid-inline-spacing',
  'scrollable-region-focusable',
  'link-in-text-block',
];

export async function expectNoAxeViolations(container: Element) {
  const results = await axe.run(container, {
    runOnly: {
      type: 'tag',
      values: [
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22a',
        'wcag22aa',
      ],
    },
    rules: Object.fromEntries(
      NEEDS_A_REAL_BROWSER.map((id) => [id, { enabled: false }]),
    ),
  });
  const summary = results.violations.map(
    (v) => `${v.id}: ${v.help} [${v.nodes.map((n) => n.target).join(', ')}]`,
  );
  expect(summary).toEqual([]);
}
