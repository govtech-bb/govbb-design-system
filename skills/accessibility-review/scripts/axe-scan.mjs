#!/usr/bin/env node
/**
 * axe-core scan over one or more URLs, for the accessibility-review skill.
 *
 * Resolves axe-core from the project — including a pnpm-store fallback, since
 * axe-core usually arrives as a transitive dependency of @storybook/addon-a11y
 * and is not resolvable from the workspace root.
 *
 *   node axe-scan.mjs http://localhost:4321/ --version 2.2 --level AA
 *   node axe-scan.mjs http://localhost:4321/ http://localhost:4321/apply/ --version 2.2 --level AA --out axe.json
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { launchBrowser, projectRequire } from './project.mjs';

const HELP = `Usage:
  node axe-scan.mjs <url> [url...] --version <x.y> --level <A|AA|AAA> [options]
  node axe-scan.mjs <url> [url...] --tags <a,b,c> [options]

Options:
  --version <x.y>         WCAG version named by the accessibility page
  --level <level>         Target conformance level; lower levels are included
  --tags <a,b,c>          Run these axe rule tags instead of the target's
  --out <file>            Write the full axe results as JSON
  --include-best-practice Also run axe's best-practice rules (not WCAG failures)
  --wait <ms>             Extra settle time after load (default 500)
  --fail-on-violations    Exit 1 if any violation is found (for CI)
  -h, --help
`;

const LEVELS = ['A', 'AA', 'AAA'];

function parseArgs(argv) {
  const o = { urls: [], wait: 500 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') o.help = true;
    else if (a === '--version') o.version = argv[++i];
    else if (a === '--level') o.level = argv[++i];
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--tags') o.tags = argv[++i].split(',').map((s) => s.trim());
    else if (a === '--include-best-practice') o.bestPractice = true;
    else if (a === '--wait') o.wait = Number(argv[++i]);
    else if (a === '--fail-on-violations') o.failOnViolations = true;
    else o.urls.push(a);
  }
  return o;
}

/** axe tags each rule with the version and level of the criterion it checks:
 *  wcag2a for WCAG 2.0 level A, wcag21aa for 2.1 AA, and so on. */
function targetTags(version, level) {
  const minor = Number(version.split('.')[1]);
  const levels = LEVELS.slice(0, LEVELS.indexOf(level) + 1);
  const tags = [];
  for (let m = 0; m <= minor; m++)
    for (const l of levels) tags.push(`wcag2${m || ''}${l.toLowerCase()}`);
  return tags;
}

/** Find axe.min.js: normal resolution first, then the pnpm store. */
function findAxeSource() {
  for (const spec of ['axe-core/axe.min.js', 'axe-core']) {
    try {
      const p = projectRequire.resolve(spec);
      const file = p.endsWith('.min.js') ? p : join(dirname(p), 'axe.min.js');
      if (existsSync(file)) return { file, how: 'node_modules' };
    } catch {
      /* keep looking */
    }
  }
  // pnpm store fallback: node_modules/.pnpm/axe-core@<ver>/node_modules/axe-core/
  let dir = process.cwd();
  while (true) {
    const store = join(dir, 'node_modules/.pnpm');
    if (existsSync(store)) {
      // Compare version numerically, not lexically: a plain sort puts
      // axe-core@4.9.0 above axe-core@4.12.1 and would quietly run an older
      // rule set than the project installed.
      const version = (name) =>
        name
          .slice(name.lastIndexOf('@') + 1)
          .split('.')
          .map((part) => Number.parseInt(part, 10) || 0);
      const match = readdirSync(store)
        .filter((n) => n.startsWith('axe-core@'))
        .sort((a, b) => {
          const [aMajor, aMinor, aPatch] = version(a);
          const [bMajor, bMinor, bPatch] = version(b);
          return aMajor - bMajor || aMinor - bMinor || aPatch - bPatch;
        })
        .pop();
      if (match) {
        const file = join(store, match, 'node_modules/axe-core/axe.min.js');
        if (existsSync(file)) return { file, how: `pnpm store (${match})` };
      }
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const opts = parseArgs(process.argv.slice(2));
if (opts.help || opts.urls.length === 0) {
  console.log(HELP);
  process.exit(opts.help ? 0 : 1);
}
if (opts.tags && (opts.version || opts.level)) {
  console.error(
    'Pass either --tags or --version and --level, not both: the tags would\n' +
      'replace the target.',
  );
  process.exit(1);
}
if (!opts.tags) {
  if (!/^\d+\.\d+$/.test(opts.version ?? '') || !LEVELS.includes(opts.level)) {
    console.error(
      'Give the target from the accessibility page as --version <x.y> and\n' +
        '--level <A|AA|AAA>, or pass --tags.',
    );
    process.exit(1);
  }
  if (!opts.version.startsWith('2.')) {
    console.error(
      `axe tags its rules by WCAG 2.x criteria only, so it has none for WCAG ${opts.version}.\n` +
        'Pass --tags to run a chosen set, and report automated coverage of the target as unconfirmed.',
    );
    process.exit(1);
  }
  opts.tags = targetTags(opts.version, opts.level);
}
const runOnly = opts.bestPractice ? [...opts.tags, 'best-practice'] : opts.tags;

const axe = findAxeSource();
if (!axe) {
  console.error(
    `Could not find axe-core from ${process.cwd()}.\n` +
      'Install it in this project: npm install -D axe-core\n' +
      'Report this in the review as "automated pass could not run" rather than guessing.',
  );
  process.exit(1);
}

const axeSource = readFileSync(axe.file, 'utf8');
console.log(`axe-core from ${axe.how}`);
console.log(`Rule tags requested: ${runOnly.join(', ')}\n`);

const browser = await launchBrowser();
const results = [];
let totalViolations = 0;
const ranTags = new Set();

try {
  for (const url of opts.urls) {
    const page = await browser.newPage();
    let result;
    try {
      const response = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30_000,
      });
      if (response && !response.ok())
        throw new Error(`HTTP ${response.status()}`);
      if (opts.wait) await page.waitForTimeout(opts.wait);
      await page.evaluate(axeSource);
      result = await page.evaluate(
        async (tags) =>
          await window.axe.run(document, {
            runOnly: { type: 'tag', values: tags },
            resultTypes: ['violations', 'incomplete'],
          }),
        runOnly,
      );
    } catch (err) {
      console.log(`## ${url}\n\n**Could not scan:** ${err.message}\n`);
      results.push({ url, error: err.message });
      await page.close();
      continue;
    }
    await page.close();

    results.push({
      url,
      violations: result.violations,
      incomplete: result.incomplete,
    });
    totalViolations += result.violations.length;
    for (const type of ['violations', 'incomplete', 'passes', 'inapplicable'])
      for (const rule of result[type])
        for (const tag of rule.tags) ranTags.add(tag);

    console.log(`## ${url}\n`);
    if (result.violations.length === 0) {
      console.log('No axe violations for the selected tags.\n');
    } else {
      for (const v of result.violations) {
        console.log(`### ${v.id} — ${v.help}`);
        console.log(`- **Impact:** ${v.impact ?? 'unknown'}`);
        console.log(
          `- **axe WCAG tags:** ${v.tags.filter((t) => t.startsWith('wcag')).join(', ') || 'n/a'}`,
        );
        console.log(`- **Nodes:** ${v.nodes.length}`);
        for (const n of v.nodes.slice(0, 5)) {
          console.log(`  - \`${n.target.join(' ')}\``);
          const why = (n.failureSummary || '').split('\n').filter(Boolean)[1];
          if (why) console.log(`    ${why.trim()}`);
        }
        if (v.nodes.length > 5)
          console.log(`  - …and ${v.nodes.length - 5} more`);
        console.log(`- **Reference:** ${v.helpUrl}\n`);
      }
    }
    if (result.incomplete?.length) {
      console.log(
        `**${result.incomplete.length} incomplete check(s)** — axe could not decide; these need a human: ` +
          result.incomplete.map((i) => i.id).join(', ') +
          '\n',
      );
    }
  }
} finally {
  await browser.close();
}

if (opts.out) {
  writeFileSync(resolve(opts.out), JSON.stringify(results, null, 2));
  console.log(`Full results written to ${resolve(opts.out)}`);
}

const failedPages = results.filter((result) => result.error).length;
// axe ignores a tag it has no rules for, and skips experimental rules, so a
// level could otherwise go unchecked without the scan saying so.
const unchecked = ranTags.size
  ? opts.tags.filter((tag) => !ranTags.has(tag))
  : [];
if (unchecked.length)
  console.log(
    `\n**No axe rule tagged ${unchecked.join(', ')} ran.** ` +
      'Check the criteria at those versions and levels by hand.',
  );
console.log(
  `\n---\n${totalViolations} violation type(s) across ${results.length - failedPages} scanned page(s); ${failedPages} page(s) could not be scanned.\n` +
    'axe finds roughly a third of real barriers. A clean run is a starting point,\n' +
    'not a pass — say so in the review.',
);

if (failedPages) process.exit(2);
if (opts.failOnViolations && totalViolations > 0) process.exit(1);
