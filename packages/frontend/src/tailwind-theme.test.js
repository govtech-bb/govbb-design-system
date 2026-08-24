import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  SKIPPED,
  generate,
  themeVar,
} from '../scripts/build-tailwind-theme.mjs';

const tokens = await readFile('src/tokens.css', 'utf8');
const names = [...tokens.matchAll(/--govbb-([a-z0-9-]+):/g)].map((m) => m[1]);

describe('tailwind theme', () => {
  it('maps or explicitly skips every token', () => {
    const unmapped = names.filter(
      (n) => !SKIPPED.has(n) && !n.startsWith('line-height-') && !themeVar(n),
    );

    expect(unmapped).toEqual([]);
  });

  it('registers the ramp under Tailwind namespaces', () => {
    const css = generate(tokens);

    expect(css).toContain('--color-teal-80: var(--govbb-teal-80);');
    expect(css).toContain('--spacing-s: var(--govbb-space-s);');
    expect(css).toContain('--font-sans: var(--govbb-font-sans);');
  });

  it('pairs each font size with a line height', () => {
    const css = generate(tokens);

    expect(css).toContain('--text-body: var(--govbb-font-size-body);');
    expect(css).toContain(
      '--text-body--line-height: var(--govbb-line-height-base);',
    );
    expect(css).toContain(
      '--text-h1--line-height: var(--govbb-line-height-h1);',
    );
  });

  it('uses @theme inline, so values stay single-indirection', () => {
    expect(generate(tokens)).toContain('@theme inline {');
  });
});
