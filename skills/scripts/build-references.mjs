/*
 * Generates the factual reference files that skills depend on, so a skill can
 * never quietly disagree with the code it describes.
 *
 *   skills/design-system-compliance/references/component-index.md
 *   skills/design-system-compliance/references/token-reference.md
 *
 * Everything here is derived from source: the component guidance pages supply
 * titles and grouping, the component stylesheets supply class names, the React
 * barrel supplies wrapper names, and the PE registry supplies which components
 * need `data-govbb-module` + `initAll()`.
 *
 * The output is committed. CI re-runs this and fails if the committed copy
 * differs, which is what forces a component PR to refresh the index in the
 * same change — the same discipline already applied to CHANGELOG.md.
 *
 *   node skills/scripts/build-references.mjs          # write
 *   node skills/scripts/build-references.mjs --check  # verify, exit 1 on drift
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../..');

const DOCS_DIR = join(REPO, 'apps/site/src/content/components');
const FRONTEND_SRC = join(REPO, 'packages/frontend/src');
const PATTERNS_DIR = join(REPO, 'apps/site/src/content/patterns');
const TEMPLATES_DIR = join(REPO, 'apps/site/src/content/templates');
const CSS_DIR = join(REPO, 'packages/frontend/src/components');
const TOKENS = join(REPO, 'packages/frontend/src/tokens.css');
const REACT_BARREL = join(REPO, 'packages/react/src/index.ts');
const PE_REGISTRY = join(REPO, 'packages/frontend/index.js');
const OUT_DIR = join(HERE, '../design-system-compliance/references');

const SITE = 'https://design-system.service.alpha.gov.bb';

const check = process.argv.includes('--check');

/** Frontmatter fields we care about. Values are unquoted scalars in this repo. */
function frontmatter(src) {
  const match = src.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const out = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([a-z]+):\s*(.*)$/i);
    if (kv) out[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '').trim();
  }
  return out;
}

/** Map each React export to the directory it comes from, via the barrel file. */
function reactExports() {
  const src = readFileSync(REACT_BARREL, 'utf8');
  const byDir = new Map();
  // `export { A, B } from './dir/file';` — value exports only, skip `export type`.
  const re = /export\s*\{([^}]*)\}\s*from\s*'\.\/([^/]+)\/[^']+';/g;
  for (const [, names, dir] of src.matchAll(re)) {
    if (/^\s*export\s+type/.test(names)) continue;
    const list = names
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);
    byDir.set(dir, [...(byDir.get(dir) ?? []), ...list]);
  }
  // Drop the `export type { … }` blocks that the regex above still matched by
  // starting at a later `export {`: type-only names are PascalCase + "Props".
  for (const [dir, names] of byDir) {
    byDir.set(
      dir,
      names.filter((n) => !n.endsWith('Props')),
    );
  }
  return byDir;
}

/** Which `data-govbb-module` values the PE runtime knows about. */
function peModules() {
  const src = readFileSync(PE_REGISTRY, 'utf8');
  const block = src.match(/const registry = \{([\s\S]*?)\};/);
  if (!block) return new Set();
  return new Set(
    [...block[1].matchAll(/^\s*'?([a-z-]+)'?:/gm)].map(([, k]) => k),
  );
}

/** Top-level `.govbb-*` class names defined in a stylesheet, deduped. */
function classesIn(cssPath) {
  let src;
  try {
    src = readFileSync(cssPath, 'utf8');
  } catch {
    return [];
  }
  const names = new Set();
  // Underscores matter: without them `govbb-summary-list__row` truncates to
  // `govbb-summary-list`, and every BEM child silently drops out of the
  // allowlist that the skill treats as definitive.
  for (const [, name] of src.matchAll(/\.(govbb-[a-z0-9_-]+)/g))
    names.add(name);
  return [...names].sort();
}

function pascal(id) {
  return id.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
}

/**
 * The class a consumer actually puts on the root element. Alphabetical order
 * is wrong for shared stylesheets — form.css would hand Fieldset
 * `.govbb-error-message` — so match the page id first, then fall back.
 */
function rootClass(id, classes) {
  return (
    classes.find((c) => c === `govbb-${id}`) ??
    classes.find((c) => c.startsWith(`govbb-${id}`)) ??
    classes[0]
  );
}

/**
 * Patterns and templates, listed so the inventory step can tell "there is
 * already an answer for this" from "this is genuinely novel". Without them a
 * reader only sees components and reinvents whole pages that already exist.
 */
function collection(dir, urlBase) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const id = file.replace(/\.md$/, '');
      const fm = frontmatter(readFileSync(join(dir, file), 'utf8'));
      return {
        id,
        title: fm.title ?? id,
        group: fm.group ?? '—',
        description: fm.description ?? '',
        url: `${SITE}${urlBase}/${id}/`,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function renderCollection(lines, heading, blurb, rows) {
  lines.push(`## ${heading}`, '', blurb, '');
  for (const group of [...new Set(rows.map((r) => r.group))].sort()) {
    lines.push(`### ${group}`, '');
    for (const r of rows.filter((x) => x.group === group)) {
      lines.push(`- **${r.title}** — ${r.description} ${r.url}`);
    }
    lines.push('');
  }
}

function buildComponentIndex() {
  const byDir = reactExports();
  const exportToDir = new Map();
  for (const [dir, names] of byDir)
    for (const n of names) exportToDir.set(n, dir);
  const modules = peModules();

  const rows = readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const id = file.replace(/\.md$/, '');
      const fm = frontmatter(readFileSync(join(DOCS_DIR, file), 'utf8'));
      // `css` frontmatter points at a shared stylesheet (checkbox + radio both
      // live in checkbox-radio); otherwise the directory matches the page id.
      const cssRef = fm.css ?? id;
      const cssPath = cssRef.includes('/')
        ? join(CSS_DIR, cssRef)
        : join(CSS_DIR, cssRef, `${cssRef}.css`);

      // React wrappers: prefer a directory matching the id, else find the
      // export whose name is the PascalCase id (fieldset and label live in form).
      let react = byDir.get(id) ?? [];
      if (react.length === 0 && exportToDir.has(pascal(id)))
        react = [pascal(id)];

      const moduleName = modules.has(cssRef)
        ? cssRef
        : modules.has(id)
          ? id
          : null;

      const classes = classesIn(cssPath);
      return {
        id,
        title: fm.title ?? id,
        group: fm.group ?? '—',
        description: fm.description ?? '',
        classes,
        root: rootClass(id, classes),
        // Several pages document one stylesheet (checkbox + radio, and the
        // form primitives). Say so, or the class list reads as this
        // component's alone.
        sharedWith: fm.css && fm.css !== id ? fm.css : null,
        react,
        module: moduleName,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  const groups = [...new Set(rows.map((r) => r.group))].sort();

  const lines = [
    '# Component index',
    '',
    '<!-- GENERATED by skills/scripts/build-references.mjs — do not edit by hand. -->',
    '',
    `Every published component, with the class it exposes, its React wrapper, and`,
    `whether it needs JavaScript. ${rows.length} components.`,
    '',
    'Read the `Docs` column before converting anything non-trivial: the guidance',
    'page says when a component is the right answer and when it is not, which',
    'this table deliberately does not duplicate. Append `.md` to any docs URL to',
    'get the raw markdown.',
    '',
    '## Needs JavaScript',
    '',
    'These degrade without it, so they need `data-govbb-module` on the markup and',
    'a single `initAll()` call after the document exists. Everything else is',
    'CSS-only. React wrappers carry their own behaviour — do not call `initAll()`',
    'over them.',
    '',
    ...rows
      .filter((r) => r.module)
      .map((r) => `- **${r.title}** — \`data-govbb-module="${r.module}"\``),
    '',
  ];

  for (const group of groups) {
    lines.push(`## Components — ${group}`, '');
    for (const r of rows.filter((x) => x.group === group)) {
      lines.push(`### ${r.title}`, '');
      if (r.description) lines.push(r.description, '');
      lines.push(
        `- Root class: \`.${r.root ?? '—'}\``,
        `- React: ${r.react.length ? r.react.map((n) => `\`<${n}>\``).join(', ') : '_none — use the HTML_'}`,
        `- JavaScript: ${r.module ? `\`data-govbb-module="${r.module}"\`` : 'not needed'}`,
        `- Docs: ${SITE}/components/${r.id}/`,
      );
      if (r.classes.length > 1) {
        lines.push(
          `- Classes in \`${r.sharedWith ?? r.id}.css\`${r.sharedWith ? ' (shared stylesheet — not all belong to this component)' : ''}: ${r.classes.map((c) => `\`${c}\``).join(', ')}`,
        );
      }
      lines.push('');
    }
  }

  // Layout and utility classes live outside the component directories, so the
  // component scan above misses them. They still have to be in the allowlist:
  // the conversion starts with the width container and grid, and a reader told
  // "if it is not in this file it does not exist" would otherwise flag
  // `.govbb-width-container` as invented.
  lines.push(
    '## Layout and utilities',
    '',
    'Not components, but real classes you will need — the page scaffold comes',
    'first in any conversion. Defined in `packages/frontend/src/layout.css` and',
    '`utilities.css`.',
    '',
  );
  for (const [file, blurb] of [
    ['layout', 'Page scaffold and grid'],
    ['utilities', 'Type scale and screen-reader helpers'],
  ]) {
    const found = classesIn(join(FRONTEND_SRC, `${file}.css`));
    lines.push(
      `**${blurb}** (\`${file}.css\`): ${found.map((c) => `\`${c}\``).join(', ')}`,
      '',
    );
  }

  const patterns = collection(PATTERNS_DIR, '/patterns');
  const templates = collection(TEMPLATES_DIR, '/templates');

  renderCollection(
    lines,
    'Patterns',
    `Task-level guidance composing several components — how to ask for an address, ` +
      `how to let someone check their answers. ${patterns.length} patterns. If the ` +
      `prototype is solving one of these problems, follow the pattern rather than ` +
      `assembling components from scratch: the pattern already encodes the ` +
      `question wording, validation and error handling.`,
    patterns,
  );

  renderCollection(
    lines,
    'Templates',
    `Whole-page scaffolds to start from. ${templates.length} templates. Patterns say ` +
      `how to solve a task; templates give you the page to fill in. Reach for one ` +
      `before hand-building a page shell — especially the error and interruption ` +
      `pages, which teams routinely forget a service needs at all.`,
    templates,
  );

  return lines.join('\n');
}

function buildTokenReference() {
  const src = readFileSync(TOKENS, 'utf8');
  const lines = [
    '# Token reference',
    '',
    '<!-- GENERATED by skills/scripts/build-references.mjs — do not edit by hand. -->',
    '',
    'Every `--govbb-*` custom property, in source order, grouped by the section',
    'headings in `packages/frontend/src/tokens.css`.',
    '',
    'Prefer the semantic names (`--govbb-color-brand`, `--govbb-space-s`) in',
    'service code. The primitive ramp exists so the semantic tier has something',
    'to resolve to; referencing a primitive directly pins you to a specific hue',
    'and loses the meaning, so a later palette change silently passes you by.',
    '',
  ];

  let section = null;
  let note = null;
  const rows = [];
  const flush = () => {
    if (!rows.length) return;
    lines.push(`## ${section ?? 'Tokens'}`, '');
    if (note) lines.push(`_${note}_`, '');
    lines.push('| Token | Value | Notes |', '| --- | --- | --- |');
    for (const r of rows)
      lines.push(`| \`${r.name}\` | \`${r.value}\` | ${r.note} |`);
    lines.push('');
    rows.length = 0;
  };

  // Walk section comments and declarations in source order. Declarations are
  // matched against the whole file rather than line by line, because several
  // values (the font stack, the color-mix wrappers) span multiple lines and a
  // line-wise parse drops them silently — worse than truncating them.
  const token =
    /\/\*\s*-+\s*(.+?)\s*-+\s*\*\/|(--govbb-[a-z0-9-]+):\s*([^;]+);[ \t]*(?:\/\*\s*(.*?)\s*\*\/)?/gs;

  for (const m of src.matchAll(token)) {
    if (m[1] !== undefined) {
      flush();
      // "Spacing. s, xm, m are confirmed; xxs/xs are placeholders" → the first
      // sentence is the heading, the remainder is a caveat worth keeping.
      const [, head, rest] = m[1].match(/^([^.]+)\.?\s*(.*)$/s);
      section = head.trim();
      note = rest.trim() || null;
      continue;
    }
    rows.push({
      name: m[2],
      value: m[3]
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\(\s+/g, '(')
        .replace(/\s+\)/g, ')'),
      note: (m[4] ?? '').trim(),
    });
  }
  flush();

  return lines.join('\n');
}

const outputs = {
  'component-index.md': buildComponentIndex(),
  'token-reference.md': buildTokenReference(),
};

let drift = false;
for (const [name, content] of Object.entries(outputs)) {
  const path = join(OUT_DIR, name);
  if (check) {
    let existing = '';
    try {
      existing = readFileSync(path, 'utf8');
    } catch {
      /* missing counts as drift */
    }
    if (existing !== content) {
      console.error(`drift: ${name} is out of date`);
      drift = true;
    }
  } else {
    writeFileSync(path, content);
    console.log(`wrote ${name}`);
  }
}

if (check) {
  if (drift) {
    console.error(
      '\nRun `node skills/scripts/build-references.mjs` and commit the result.',
    );
    process.exit(1);
  }
  console.log('references are up to date');
}
