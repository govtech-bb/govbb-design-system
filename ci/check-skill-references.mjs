/*
 * Fails when a skill names something the design system no longer ships: a
 * govbb- class, a --govbb- token, a data-govbb- attribute, a package export or
 * a docs page. The skills teach agents to write markup, so a stale name there
 * becomes broken markup in services while every other check stays green.
 *
 * Like the skills' own scripts, it keeps no inventory: the built stylesheet,
 * the runtime source, the package exports and the built site are the allowlist.
 * Run after `pnpm build`.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const frontend = 'packages/frontend';
const siteDist = 'apps/site/dist';
const REPO_SLUG = 'govbb-design-system';

const walk = (dir, keep) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory())
      return entry.name === 'node_modules' ? [] : walk(path, keep);
    return keep(path) ? [path] : [];
  });

for (const path of [`${frontend}/dist/govbb.css`, siteDist]) {
  if (!existsSync(path)) {
    console.error(`${path} is missing. Run pnpm build first.`);
    process.exit(2);
  }
}

const css = readFileSync(`${frontend}/dist/govbb.css`, 'utf8');
const read = (paths) => paths.map((p) => readFileSync(p, 'utf8')).join('\n');
const kebab = (camel) => camel.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const runtime = read([
  `${frontend}/index.js`,
  ...walk(`${frontend}/src`, (p) => p.endsWith('.js') && !p.includes('.test.')),
]);
const react = read(
  walk(
    'packages/react/src',
    (p) => p.endsWith('.tsx') && !/\.(test|stories)\./.test(p),
  ),
);

// Some documented classes and tokens are never styled or defined: markup
// hooks like govbb-footer__item, and properties the CSS only reads with a
// fallback, like --govbb-summary-section-gap. Those are still real names.
const classes = new Set([
  ...[...css.matchAll(/\.(govbb-[\w-]+)/g)].map((m) => m[1]),
  ...[...`${runtime}\n${react}`.matchAll(/(?<![\w-])(govbb-[\w-]+)/g)].map(
    (m) => m[1],
  ),
]);
const tokens = new Set(
  [...css.matchAll(/(--govbb-[\w-]+)\s*:|var\(\s*(--govbb-[\w-]+)/g)].map(
    (m) => m[1] ?? m[2],
  ),
);
const attributes = new Set([
  ...[...runtime.matchAll(/\b(data-govbb-[\w-]+)/g)].map((m) => m[1]),
  ...[...runtime.matchAll(/\bdataset\.(govbb\w+)/g)].map(
    (m) => `data-${kebab(m[1])}`,
  ),
]);

const packageExports = Object.fromEntries(
  ['frontend', 'react'].map((name) => [
    name,
    JSON.parse(readFileSync(`packages/${name}/package.json`, 'utf8')).exports,
  ]),
);
// A wildcard export (./assets/*) matches any subpath, so the file it maps to
// is what has to exist.
const isExported = (name, subpath) =>
  Object.entries(packageExports[name]).some(([key, target]) => {
    if (key === subpath) return true;
    const [before, after] = key.split('*');
    if (after === undefined || typeof target !== 'string') return false;
    if (!subpath.startsWith(before) || !subpath.endsWith(after)) return false;
    const matched = subpath.slice(before.length, subpath.length - after.length);
    return existsSync(join('packages', name, target.replace('*', matched)));
  });

// Guards against passing by comparing against nothing.
for (const [what, set] of Object.entries({ classes, tokens, attributes })) {
  if (set.size === 0) {
    console.error(
      `Found no ${what} in the design system; the parse is broken.`,
    );
    process.exit(2);
  }
}

// Names are captured whole, so a misspelt suffix (govbb-button__labelX) cannot
// pass as the valid name in front of it.
const NAME =
  /(?<![\w-])(--govbb-[\w-]*\w|data-govbb-[\w-]*\w|govbb-[\w-]*\w|dataset\.govbb\w+)(\.(?:md|mjs|js|css|json|txt|svg|png|ico|woff2)\b)?/g;
const PACKAGE = /@govtech-bb\/(frontend|react)(\/[\w./*-]*[\w*])?/g;
// A bare path counts only in backticks, so output files in shell examples
// (`--out <scratch>/report.md`) are not taken for docs pages.
const PAGE =
  /(?:https:\/\/design-system\.service\.alpha\.gov\.bb|`)(\/[a-z0-9-]+(?:\/[a-z0-9-]+)*(?:\.(?:md|txt)\b|\/(?![\w-])))/g;

const problem = (name) => {
  if (name.startsWith('dataset.')) name = `data-${kebab(name.slice(8))}`;
  if (name.startsWith('--')) return tokens.has(name) ? null : 'no such token';
  if (name.startsWith('data-'))
    return attributes.has(name) ? null : 'not used by the runtime';
  // Token names are passed bare to contrast.mjs.
  if (classes.has(name) || tokens.has(`--${name}`) || name === REPO_SLUG)
    return null;
  return 'no such class or token';
};

const sources = walk(
  process.argv[2] ?? 'skills',
  (p) => p.endsWith('.md') || (p.endsWith('.mjs') && !p.endsWith('.test.mjs')),
);
const failures = [];
let checked = 0;
for (const file of sources) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      const fail = (name, reason) =>
        failures.push(`${file}:${index + 1}  ${name}  (${reason})`);
      for (const [, name, extension] of line.matchAll(NAME)) {
        if (extension) continue; // a file name, like govbb-contrast.md
        checked++;
        const reason = problem(name);
        if (reason) fail(name, reason);
      }
      for (const [match, name, subpath] of line.matchAll(PACKAGE)) {
        checked++;
        if (!isExported(name, subpath ? `.${subpath}` : '.'))
          fail(match, 'not in the package exports');
      }
      for (const [, path] of line.matchAll(PAGE)) {
        checked++;
        const built = path.endsWith('/') ? `${path}index.html` : path;
        if (!existsSync(join(siteDist, built)))
          fail(path, 'not in the built site');
      }
    });
}

if (failures.length) {
  console.error(
    `Skills name ${failures.length} thing(s) the design system does not ship:\n`,
  );
  console.error(failures.join('\n'));
  console.error(
    '\nUpdate the skill to match the component, or restore what was removed.',
  );
  process.exit(1);
}
console.log(`Checked ${checked} references in ${sources.length} skill files.`);
