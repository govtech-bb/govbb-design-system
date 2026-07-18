import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('published CSS entry', () => {
  it('stays unlayered so consumer resets do not outrank components', async () => {
    const css = await readFile('src/index.css', 'utf8');

    expect(css).not.toMatch(/@layer\b/);
    expect(css).not.toMatch(/\blayer\s*\(/);
  });
});
