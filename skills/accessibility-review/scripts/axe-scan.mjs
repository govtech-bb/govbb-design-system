#!/usr/bin/env node
/**
 * axe-core scan over one or more URLs, for the accessibility-review skill.
 *
 * Resolves axe-core from the project — including a pnpm-store fallback, since
 * axe-core usually arrives as a transitive dependency of @storybook/addon-a11y
 * and is not resolvable from the workspace root.
 *
 *   node axe-scan.mjs http://localhost:4321/
 *   node axe-scan.mjs http://localhost:4321/ http://localhost:4321/apply/ --out axe.json
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { launchBrowser, projectRequire } from './project.mjs';

const HELP = `Usage:
  node axe-scan.mjs <url> [url...] [options]

Options:
  --out <file>            Write the full axe results as JSON
  --tags <a,b,c>          Override rule tags
                          (default: wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa)
  --include-best-practice Also run axe's best-practice rules (not WCAG failures)
  --wait <ms>             Extra settle time after load (default 500)
  --fail-on-violations    Exit 1 if any violation is found (for CI)
  -h, --help
`;

function parseArgs(argv) {
  const o = {
    urls: [],
    tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
    wait: 500,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') o.help = true;
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--tags') o.tags = argv[++i].split(',').map((s) => s.trim());
    else if (a === '--include-best-practice') o.bestPractice = true;
    else if (a === '--wait') o.wait = Number(argv[++i]);
    else if (a === '--fail-on-violations') o.failOnViolations = true;
    else o.urls.push(a);
  }
  return o;
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
console.log(`axe-core from ${axe.how}\n`);

const browser = await launchBrowser();
const results = [];
let totalViolations = 0;

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
      const runOnly = opts.bestPractice
        ? [...opts.tags, 'best-practice']
        : opts.tags;
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

    console.log(`## ${url}\n`);
    if (result.violations.length === 0) {
      console.log('No axe violations for the selected tags.\n');
    } else {
      for (const v of result.violations) {
        console.log(`### ${v.id} — ${v.help}`);
        console.log(`- **Impact:** ${v.impact ?? 'unknown'}`);
        console.log(
          `- **Criteria:** ${v.tags.filter((t) => t.startsWith('wcag')).join(', ') || 'n/a'}`,
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
console.log(
  `\n---\n${totalViolations} violation type(s) across ${results.length - failedPages} scanned page(s); ${failedPages} page(s) could not be scanned.\n` +
    'axe finds roughly a third of real barriers. A clean run is a starting point,\n' +
    'not a pass — say so in the review.',
);

if (failedPages) process.exit(2);
if (opts.failOnViolations && totalViolations > 0) process.exit(1);
