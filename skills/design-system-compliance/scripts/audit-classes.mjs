#!/usr/bin/env node
/**
 * Name audit for the design-system-compliance skill.
 *
 * The skill's first rule is never to write a `govbb-` class or `--govbb-` token
 * you have not just read in the design system's own documentation or source.
 * Fluent, correctly prefixed, plausible names are how this work goes wrong, and
 * they survive review because they look exactly like the real ones. An undefined
 * class renders as unstyled markup; an undefined custom property resolves to
 * nothing at all.
 *
 * The skill used to describe this as "a few lines of scripting", which invited
 * every run to rewrite it and get it subtly different. This is that script.
 *
 * It holds no inventory of its own — the stylesheet is the allowlist, resolved
 * at run time — so adding or renaming a component obliges nobody to edit it.
 *
 * Two things it deliberately does not do:
 *
 *   - It does not decide that an unresolved name is *invented*. A name can
 *     appear in the design system's own canonical markup and still match no
 *     rule; the skill says the documentation wins over this audit, so the
 *     script must not contradict its own skill. Unresolved names are reported
 *     as unresolved, with that caveat attached.
 *   - It does not verify that a selector matches. `.govbb-error-summary__link`
 *     is styled only as `.govbb-link.govbb-error-summary__link`, so using it
 *     alone renders unstyled while passing every existence check here. Copying
 *     the documented markup is what protects you there.
 *
 *   node audit-classes.mjs ./converted-site
 *   node audit-classes.mjs ./converted-site --css path/to/govbb.css
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HELP = `Usage:
  node audit-classes.mjs <dir> [options]

Options:
  --css <path>  Stylesheet to resolve names against. Without it, the script
                looks for an installed @govtech-bb/frontend under <dir>, then
                for a built dist/govbb.css in this repo. It always prints which
                one it used, because a checkout can be behind the deployed site
                and a local-only audit then reports real names as invented.
  --json        Emit results as JSON
  -h, --help

Reports:
  · govbb- classes used that do not resolve in the stylesheet
  · --govbb- custom properties used that are not defined
  · service CSS selectors that target a govbb- class (restyling internals)
`;

const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help') || args.length === 0) {
  console.log(HELP);
  process.exit(args.length === 0 ? 2 : 0);
}
const asJson = args.includes('--json');
const ci = args.indexOf('--css');
const cssArg = ci !== -1 ? args[ci + 1] : null;
const dir = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--css');

if (!dir || !existsSync(dir) || !statSync(dir).isDirectory()) {
  console.error(`not a directory: ${dir ?? '(none given)'}`);
  process.exit(2);
}

/* Resolve the stylesheet, and say which one won. */
const REPO = fileURLToPath(new URL('../../../', import.meta.url));
const candidates = [
  cssArg,
  join(dir, 'node_modules/@govtech-bb/frontend/dist/govbb.css'),
  join(REPO, 'packages/frontend/dist/govbb.css'),
].filter(Boolean);
const cssPath = candidates.find((p) => existsSync(p));

if (!cssPath) {
  console.error(
    'no stylesheet found to resolve names against. Tried:\n' +
      candidates.map((c) => `  ${c}`).join('\n') +
      '\nInstall @govtech-bb/frontend@alpha in the output directory, build the\n' +
      'package (pnpm --filter @govtech-bb/frontend build), or pass --css.',
  );
  process.exit(2);
}

const css = readFileSync(cssPath, 'utf8');
const realClasses = new Set(
  [...css.matchAll(/\.(govbb-[a-zA-Z0-9_-]+)/g)].map((m) => m[1]),
);
const realTokens = new Set(
  [...css.matchAll(/(--govbb-[a-zA-Z0-9-]+)\s*:/g)].map((m) => m[1]),
);

/*
 * Refuse rather than grade everything as invented. A missing, truncated or
 * wrong-package stylesheet does not weaken this audit, it inverts it — and the
 * failure reads as a run that invented all its names.
 */
for (const [what, set, floor] of [
  ['classes', realClasses, 40],
  ['tokens', realTokens, 20],
]) {
  if (set.size < floor) {
    console.error(
      `only ${set.size} ${what} found in ${cssPath} — expected at least ${floor}.\n` +
        'That stylesheet is empty, truncated, or not the design system. Refusing\n' +
        'to audit against it, because every real name would report as invented.',
    );
    process.exit(2);
  }
}

/* Vendored trees are not the run's own output; grading them attributes the
   design system's own CSS to whoever wrote the page. */
const SKIP = /(^|\/)(node_modules|vendor|dist|\.git)(\/|$)/;
const SOURCE = /\.(html|htm|[mc]?jsx?|[mc]?tsx?|css|astro|vue|svelte)$/i;

function walk(d, root = d) {
  if (!existsSync(d)) return [];
  return readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = join(d, e.name);
    if (SKIP.test(p.slice(root.length))) return [];
    if (e.isSymbolicLink()) return [];
    return e.isDirectory() ? walk(p, root) : SOURCE.test(p) ? [p] : [];
  });
}

/* Never audit the stylesheet we are resolving against. A copy of govbb.css
   inside the output directory is the design system's own CSS, and every rule in
   it would otherwise report as the service restyling a component. */
const resolved = resolve(cssPath);
const files = walk(dir)
  .filter((f) => resolve(f) !== resolved)
  .map((f) => ({ file: f, text: readFileSync(f, 'utf8') }));
if (files.length === 0) {
  console.error(`no source files found under ${dir}`);
  process.exit(2);
}

const usedClasses = new Map();
const usedTokens = new Map();
const restyled = new Map();

for (const { file, text } of files) {
  for (const m of text.matchAll(/class(?:Name)?=["'{`]([^"'}`]+)["'}`]/g))
    for (const c of m[1].split(/\s+/))
      if (c.startsWith('govbb-') && !usedClasses.has(c))
        usedClasses.set(c, file);

  for (const m of text.matchAll(/var\(\s*(--govbb-[a-zA-Z0-9-]+)/g))
    if (!usedTokens.has(m[1])) usedTokens.set(m[1], file);

  /* A margin on .govbb-list restyles a component's internals and makes this
     service disagree with every other one. Only meaningful in the service's own
     CSS, so skip the design system's stylesheet if it is inside the tree. */
  if (extname(file) === '.css' && !SKIP.test(file)) {
    for (const m of text.matchAll(
      /(^|[,{}])\s*([^{},]*\.govbb-[a-zA-Z0-9_-]+[^{},]*)\{/g,
    )) {
      const sel = m[2].trim();
      if (sel && !restyled.has(sel)) restyled.set(sel, file);
    }
  }
}

const rel = (f) => f.slice(dir.length).replace(/^\//, '');

/* Cap long lists so the signal is not buried, and always say how many were not
   shown — a silent truncation reads as "that was all of them". */
const CAP = 8;
const listed = (entries, render) => {
  for (const e of entries.slice(0, CAP)) console.log(`          ${render(e)}`);
  if (entries.length > CAP)
    console.log(
      `          … and ${entries.length - CAP} more (--json for all)`,
    );
};
const badClasses = [...usedClasses].filter(([c]) => !realClasses.has(c));
const badTokens = [...usedTokens].filter(([t]) => !realTokens.has(t));

const results = {
  stylesheet: cssPath,
  defined: { classes: realClasses.size, tokens: realTokens.size },
  used: {
    classes: usedClasses.size,
    tokens: usedTokens.size,
    files: files.length,
  },
  unresolvedClasses: badClasses.map(([c, f]) => ({ name: c, file: rel(f) })),
  undefinedTokens: badTokens.map(([t, f]) => ({ name: t, file: rel(f) })),
  restyledSelectors: [...restyled].map(([s, f]) => ({
    selector: s,
    file: rel(f),
  })),
};

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  console.log(`\nResolved against ${cssPath}`);
  console.log(
    `  ${results.defined.classes} classes and ${results.defined.tokens} tokens defined`,
  );
  console.log(
    `  ${results.used.classes} classes and ${results.used.tokens} tokens used across ${results.used.files} file(s)\n`,
  );

  if (badClasses.length) {
    console.log(`  FAIL  ${badClasses.length} class(es) do not resolve:`);
    listed(badClasses, ([c, f]) => `${c}  (${rel(f)})`);
    console.log(
      "        A name that appears in the design system's own canonical markup\n" +
        '        but matches no rule is a documentation conflict, not an invented\n' +
        '        name. Check the component page before removing it.',
    );
  } else console.log('  ok    every govbb- class resolves');

  if (badTokens.length) {
    console.log(`  FAIL  ${badTokens.length} token(s) are not defined:`);
    listed(badTokens, ([t, f]) => `${t}  (${rel(f)})`);
  } else console.log('  ok    every --govbb- token is defined');

  if (restyled.size) {
    console.log(`  FAIL  ${restyled.size} selector(s) restyle a component:`);
    listed([...restyled], ([sel, f]) => `${sel}  (${rel(f)})`);
    console.log(
      '        Put the rule on your own class instead. Overriding a govbb- class\n' +
        '        makes this service disagree with every other one.',
    );
  } else console.log('  ok    no service CSS targets a govbb- class');
  console.log();
}

const failed =
  badClasses.length > 0 || badTokens.length > 0 || restyled.size > 0;
process.exit(failed ? 1 : 0);
