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

  it('does not attach design-system spacing to text elements', async () => {
    const css = await readFile('src/base.css', 'utf8');

    // Every base rule targeting a heading or paragraph: layout owns spacing,
    // so none of them may reach for a spacing token.
    const textRules = [
      ...css.matchAll(/:where\(((?:h[1-6]|p)[^)]*)\)\s*{([^}]*)}/g),
    ];

    expect(textRules.length).toBeGreaterThan(2);
    expect(
      textRules.every(
        ([, , declarations]) => !declarations.includes('var(--govbb-space-'),
      ),
    ).toBe(true);

    // The margin reset itself still has to be there, once per element group.
    const resets = textRules.filter(([, , declarations]) =>
      declarations.includes('margin-block: 0;'),
    );

    expect(resets).toHaveLength(2);
  });

  it('stacks both legacy and semantic footer-link markup', async () => {
    const css = await readFile('src/components/footer/footer.css', 'utf8');
    const sharedLayout = css.match(
      /\.govbb-footer__nav,\s*\.govbb-footer__list\s*{([^}]*)}/,
    );
    const listRules = [...css.matchAll(/\.govbb-footer__list\s*{([^}]*)}/g)];
    const listReset = listRules.at(-1);

    expect(sharedLayout?.[1]).toContain('display: flex;');
    expect(sharedLayout?.[1]).toContain('flex-direction: column;');
    expect(sharedLayout?.[1]).toContain('gap: var(--govbb-space-xs);');
    expect(sharedLayout?.[1]).not.toContain('padding: 0;');
    expect(listReset?.[1]).toContain('padding: 0;');
  });
});
