import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

async function findCssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findCssFiles(entryPath);
      return entryPath.endsWith('.css') ? [entryPath] : [];
    }),
  );
  return files.flat();
}

describe('published CSS entry', () => {
  it('stays unlayered so consumer resets do not outrank components', async () => {
    const css = await readFile('src/index.css', 'utf8');

    expect(css).not.toMatch(/@layer\b/);
    expect(css).not.toMatch(/\blayer\s*\(/);
  });

  it('defines every GovBB custom property used by package CSS', async () => {
    const files = await findCssFiles('src');
    const css = (
      await Promise.all(files.map((file) => readFile(file, 'utf8')))
    ).join('\n');
    const definitions = new Set(
      [...css.matchAll(/(--govbb-[a-z0-9-]+)\s*:/g)].map((match) => match[1]),
    );
    const references = new Set(
      [...css.matchAll(/var\((--govbb-[a-z0-9-]+)/g)].map((match) => match[1]),
    );

    expect([...references].filter((token) => !definitions.has(token))).toEqual(
      [],
    );
  });
});
