import axe from 'axe-core';
import { expect } from 'vitest';

/*
 * WCAG 2.0 A/AA check for component tests. color-contrast is excluded — jsdom
 * does no layout/painting, so axe cannot compute it; contrast is a token
 * concern checked in the frontend package's design review.
 */
export async function expectNoAxeViolations(container: Element) {
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
    rules: { 'color-contrast': { enabled: false } },
  });
  const summary = results.violations.map(
    (v) => `${v.id}: ${v.help} [${v.nodes.map((n) => n.target).join(', ')}]`,
  );
  expect(summary).toEqual([]);
}
