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
} finally {
  server.close();
  rmSync(root, { recursive: true, force: true });
}
