#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = mkdtempSync(join(tmpdir(), 'govbb-a11y-test-'));
const installed = join(root, 'external-skill');
cpSync(dirname(fileURLToPath(import.meta.url)), installed, { recursive: true });
const consumer = join(root, 'consumer');
const cwd = join(consumer, 'apps/service');
mkdirSync(cwd, { recursive: true });
const dependencies = join(consumer, 'node_modules');
mkdirSync(dependencies);
const require = createRequire(resolve(process.cwd(), 'package.json'));
symlinkSync(
  dirname(require.resolve('playwright/package.json')),
  join(dependencies, 'playwright'),
  'dir',
);
let axe;
try {
  axe = require.resolve('axe-core/axe.min.js');
} catch {
  axe = createRequire(
    require.resolve('@storybook/addon-a11y/package.json'),
  ).resolve('axe-core/axe.min.js');
}
const store = join(dependencies, '.pnpm/axe-core@4.12.0/node_modules');
mkdirSync(store, { recursive: true });
symlinkSync(dirname(axe), join(store, 'axe-core'), 'dir');
const older = join(dependencies, '.pnpm/axe-core@4.9.0/node_modules/axe-core');
mkdirSync(older, { recursive: true });
writeFileSync(
  join(older, 'axe.min.js'),
  'throw new Error("older axe selected");',
);

const frontend = join(dependencies, '@govtech-bb/frontend');
mkdirSync(frontend, { recursive: true });
writeFileSync(
  join(frontend, 'package.json'),
  JSON.stringify({
    name: '@govtech-bb/frontend',
    exports: { './tokens.css': './exported-tokens.css' },
  }),
);
writeFileSync(
  join(frontend, 'exported-tokens.css'),
  ':root { --govbb-black: #000; --govbb-color-ink: var(--govbb-black); --govbb-color-surface: #fff; }',
);
const empty = join(root, 'empty');
mkdirSync(empty);

const pages = {
  '/clean':
    '<main><h1>Apply</h1><label for="name">Name</label><input id="name"><a href="/clean">Next</a><a href="/clean">Help</a></main>',
  '/bad': '<main><h1>Apply</h1><input><button></button></main>',
  '/no-ring':
    '<style>a:focus { outline: none; box-shadow: 0 0 0 3px rgba(0,0,0,0); }</style><main><h1>Apply</h1><a href="/clean">Next</a><a href="/clean">Help</a></main>',
};
const server = createServer((req, res) => {
  const body = pages[req.url];
  res.writeHead(body ? 200 : 404, { 'content-type': 'text/html' });
  res.end(
    `<!doctype html><html lang="en"><head><title>Apply for a service</title></head><body>${body || 'Not found'}</body></html>`,
  );
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const run = (script, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(installed, script), ...args], {
      cwd,
      ...options,
    });
    let stdout = '',
      stderr = '';
    child.stdout.on('data', (data) => (stdout += data));
    child.stderr.on('data', (data) => (stderr += data));
    child.on('error', reject);
    child.on('close', (status) => resolve({ status, stdout, stderr }));
  });

try {
  for (const [colours, ratio, verdict] of [
    [['#000', '#fff'], '21.00', 'PASS'],
    [['#fff', '#fff'], '1.00', 'FAIL'],
  ]) {
    const result = await run('contrast.mjs', colours, { cwd: empty });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, new RegExp(`Contrast ratio: ${ratio}:1`));
    assert.match(result.stdout, new RegExp(`AA, needs 4.5:1\\): ${verdict}`));
  }
  const tokens = await run('contrast.mjs', ['color-ink', 'color-surface']);
  assert.equal(tokens.status, 0, tokens.stderr);
  assert.match(tokens.stdout, /Contrast ratio: 21.00:1/);
  assert.ok(tokens.stdout.includes(join(frontend, 'exported-tokens.css')));
  const explicit = join(root, 'override.css');
  writeFileSync(
    explicit,
    ':root { --govbb-color-ink: #fff; --govbb-color-surface: #fff; }',
  );
  const override = await run('contrast.mjs', [
    'color-ink',
    'color-surface',
    '--tokens-file',
    explicit,
  ]);
  assert.equal(override.status, 0, override.stderr);
  assert.match(override.stdout, /Contrast ratio: 1.00:1/);
  const missing = await run('contrast.mjs', ['color-ink', 'color-surface'], {
    cwd: empty,
  });
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /--tokens-file/);
  for (const args of [
    ['#0008', '#fff'],
    ['unknown', '#fff'],
    ['color-ink', 'color-surface', '--tokens-file', 'missing.css'],
  ]) {
    const result = await run('contrast.mjs', args);
    assert.notEqual(result.status, 0, JSON.stringify(result));
  }
  writeFileSync(
    explicit,
    ':root { --govbb-color-ink: var(--govbb-color-surface); --govbb-color-surface: var(--govbb-color-ink); }',
  );
  for (const args of [['color-ink', 'color-surface'], ['--tokens']]) {
    const cycle = await run('contrast.mjs', [
      ...args,
      '--tokens-file',
      explicit,
    ]);
    assert.equal(cycle.status, 1);
    assert.match(cycle.stderr, /circular/);
  }
  console.log(
    'PASS contrast ratios, exported consumer tokens, overrides and errors',
  );

  const clean = await run('axe-scan.mjs', [
    `${base}/clean`,
    '--wait',
    '0',
    '--fail-on-violations',
  ]);
  assert.equal(clean.status, 0, clean.stderr || clean.stdout);
  assert.match(clean.stdout, /No axe violations/);
  const bad = await run('axe-scan.mjs', [
    `${base}/bad`,
    '--wait',
    '0',
    '--fail-on-violations',
  ]);
  assert.equal(bad.status, 1, bad.stderr || bad.stdout);
  assert.match(bad.stdout, /label|button-name/);
  const unavailable = await run('axe-scan.mjs', [
    `${base}/missing`,
    '--wait',
    '0',
  ]);
  assert.equal(unavailable.status, 2);
  assert.match(unavailable.stdout, /HTTP 404/);
  const missingAxe = await run('axe-scan.mjs', [`${base}/clean`], {
    cwd: empty,
  });
  assert.notEqual(missingAxe.status, 0);
  assert.match(missingAxe.stderr, /npm install -D axe-core/);
  console.log(
    'PASS axe uses consumer pnpm store, detects violations and fails incomplete scans',
  );

  const focus = await run('focus-order.mjs', [
    `${base}/clean`,
    '--wait',
    '0',
    '--max-tabs',
    '8',
  ]);
  assert.equal(focus.status, 0, focus.stderr);
  assert.doesNotMatch(
    focus.stdout,
    /\*\*Focus trap:\*\*|showed neither an outline/,
  );
  const ring = await run('focus-order.mjs', [
    `${base}/no-ring`,
    '--wait',
    '0',
    '--max-tabs',
    '8',
  ]);
  assert.equal(ring.status, 0, ring.stderr);
  assert.match(ring.stdout, /showed neither an outline nor a box-shadow/);
  const missingPlaywright = await run('focus-order.mjs', [`${base}/clean`], {
    cwd: empty,
  });
  assert.equal(missingPlaywright.status, 2);
  assert.match(missingPlaywright.stderr, /npm install -D playwright/);
  const noBrowser = await run('focus-order.mjs', [`${base}/clean`], {
    env: {
      ...process.env,
      PLAYWRIGHT_BROWSERS_PATH: join(root, 'missing-browsers'),
    },
  });
  assert.equal(noBrowser.status, 2);
  assert.match(noBrowser.stderr, /npx playwright install chromium/);
  console.log(
    'PASS focus walk distinguishes nodes and transparent rings; tooling failures are actionable',
  );

  // Mirrors the W3C markup: criteria write id before class, guidelines and
  // principles write class before id and sit between criteria.
  const sc = (id, number, name, level, body) =>
    `<section id="${id}" class="guideline"><div class="header-wrapper"><h4 id="x-${id}"><bdi class="secno">Success Criterion ${number} </bdi>${name}</h4></div>` +
    `<div class="doclinks"><a href="#">Understanding ${name}</a></div>` +
    (level ? `<p class="conformance-level">(Level ${level})</p>` : '') +
    `${body}</section>`;
  const guideline = (id, heading, criteria) =>
    `<section class="guideline" id="${id}"><div class="header-wrapper"><h3><bdi class="secno">Guideline ${heading} </bdi>Heading ${heading}</h3></div>` +
    `<div class="doclinks"><a href="#">Understanding guideline ${heading}</a></div><p>Guideline statement ${heading}.</p>${criteria}</section>`;
  const spec = (
    criteria,
    { title = 'WCAG 9.9', state = 'W3C Recommendation' } = {},
  ) =>
    `<html><head><title>${title}</title></head><body><p id="w3c-state">${state} <time>1 January 2030</time></p>` +
    `<section class="principle" id="perceivable"><h2>1. Perceivable</h2><p>Principle statement.</p>${criteria}</section>` +
    `<section id="glossary"><dl>` +
    `<dt><dfn id="dfn-large">large</dfn></dt><dd><p>at least 18 <a href="#dfn-point">point</a>, where both 1 and 2 hold:</p>` +
    `<ol><li><p>first condition</p></li><li><p>second condition, one of:</p><ol><li>option a</li><li>option b</li></ol></li></ol></dd>` +
    `<dt class="new"><dfn id="dfn-point">point</dfn></dt><dd><p class="change">New</p><p>a unit &amp; a size &lt;= 1</p></dd>` +
    `<dt><dfn id="dfn-unused">unused</dfn></dt><dd><p>never referenced</p></dd>` +
    `</dl></section></body></html>`;
  const complete = join(root, 'spec.html');
  const criteria =
    guideline(
      'one-g',
      '1.1',
      sc(
        'one',
        '1.1.1',
        'First',
        'A',
        '<p>Text is <a href="#dfn-large">large</a>.</p>',
      ),
    ) +
    guideline(
      'two-g',
      '1.2',
      sc(
        'two',
        '1.2.1',
        'Second',
        'AA',
        '<p class="change">New</p><p>Second text.</p><dl><dt>Exception</dt><dd><p>Unless essential.</p></dd></dl>',
      ) +
        sc('three', '1.2.2', 'Third', 'AAA', '<p>Third text.</p>') +
        sc('old', '1.2.3', 'Old (Obsolete and removed)', '', '<p>Removed.</p>'),
    );
  writeFileSync(complete, spec(criteria));
  const checklist = await run('wcag-checklist.mjs', [
    '--file',
    complete,
    '--version',
    '9.9',
    '--level',
    'AA',
  ]);
  assert.equal(checklist.status, 0, checklist.stderr);
  assert.match(
    checklist.stdout,
    /2 success criteria: 1 at Level A, 1 at Level AA/,
  );
  assert.match(
    checklist.stdout,
    /Left out as obsolete or removed: 1\.2\.3 Old/,
  );
  assert.match(
    checklist.stdout,
    /## 1\.1\.1 First \(Level A\)\n\nText is large\.\n\n## 1\.2\.1/,
  );
  assert.match(
    checklist.stdout,
    /## 1\.2\.1 Second \(Level AA\)\n\nSecond text\.\n\n\*\*Exception\*\*\n\nUnless essential\./,
  );
  assert.match(
    checklist.stdout,
    /hold:\n1\. first condition\n2\. second condition, one of:\n {3}1\. option a\n {3}2\. option b/,
  );
  assert.match(checklist.stdout, /### point\n\na unit & a size <= 1/);
  assert.doesNotMatch(
    checklist.stdout,
    /1\.2\.2|Understanding|Guideline|Principle|unused|^New$/m,
  );

  for (const [label, file, args, pattern] of [
    [
      'wrong version',
      spec(criteria),
      ['--version', '9.8'],
      /Asked for WCAG 9\.8/,
    ],
    [
      'draft',
      spec(criteria, { state: "W3C Editor's Draft" }),
      [],
      /not a W3C Recommendation/,
    ],
    ['unsupported markup', spec(''), [], /not supported/],
  ]) {
    writeFileSync(complete, file);
    const result = await run('wcag-checklist.mjs', [
      '--file',
      complete,
      '--level',
      'AA',
      ...args,
    ]);
    assert.equal(result.status, 2, label);
    assert.match(result.stderr, pattern, label);
    assert.match(result.stderr, /There is no checklist/, label);
  }
  writeFileSync(
    complete,
    spec(sc('one', '1.1.1', 'First', '', '<p>No level.</p>')),
  );
  const incomplete = await run('wcag-checklist.mjs', [
    '--file',
    complete,
    '--level',
    'AA',
  ]);
  assert.equal(incomplete.status, 1);
  assert.match(
    incomplete.stderr,
    /incomplete[\s\S]*1\.1\.1 First has no level/,
  );
  const unreadable = await run('wcag-checklist.mjs', [
    '--file',
    join(root, 'none.html'),
    '--level',
    'AA',
  ]);
  assert.equal(unreadable.status, 2);
  assert.match(unreadable.stderr, /There is no checklist/);
  writeFileSync(complete, spec(criteria));
  for (const [args, pattern] of [
    [['--level', 'aa'], /--level must be one of/],
    [
      ['--level', 'AA', '--out', join(root, 'missing', 'x.md')],
      /Could not write/,
    ],
  ]) {
    const result = await run('wcag-checklist.mjs', [
      '--file',
      complete,
      ...args,
    ]);
    assert.equal(result.status, 3);
    assert.match(result.stderr, pattern);
  }
  console.log(
    'PASS wcag checklist quotes criteria only, keeps list numbering, follows glossary terms and refuses wrong, draft or incomplete specifications',
  );
} finally {
  server.close();
  rmSync(root, { recursive: true, force: true });
}
