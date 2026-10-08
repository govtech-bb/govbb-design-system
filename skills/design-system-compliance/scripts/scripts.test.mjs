#!/usr/bin/env node
/**
 * Tests for this directory's scripts.
 *
 * ADR 0004: an instrument that nothing tests is measuring nothing. This repo has
 * already shipped six checks that passed while examining the wrong thing — a
 * layout reproducer run against an unstyled page, a focus walk counting a
 * transparent shadow, a grader comparing two empty sets, a trap assertion
 * matching strings nobody typed. None failed loudly.
 *
 * So every check here is asserted in BOTH directions: it catches the planted
 * defect, and it does not fire on the clean case. A test that only ever sees
 * broken input cannot tell you the check discriminates.
 *
 *   node scripts.test.mjs
 */

import { createServer } from 'node:http';
import {
  mkdtempSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  cpSync,
  symlinkSync,
  realpathSync,
} from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
let failures = 0;
const ok = (name, passed, detail = '') => {
  console.log(
    `  ${passed ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`,
  );
  if (!passed) failures++;
};

/* ---------- fixtures ---------- */
const root = mkdtempSync(join(tmpdir(), 'govbb-scripts-test-'));
const installed = join(root, 'external-skill');
cpSync(HERE, installed, { recursive: true });
const consumer = join(root, 'consumer');
const cwd = join(consumer, 'apps/service');
mkdirSync(cwd, { recursive: true });
mkdirSync(join(consumer, 'node_modules/@playwright'), { recursive: true });
const require = createRequire(resolve(process.cwd(), 'package.json'));
symlinkSync(
  dirname(require.resolve('@playwright/test/package.json')),
  join(consumer, 'node_modules/@playwright/test'),
  'dir',
);
const empty = join(root, 'empty-consumer');
mkdirSync(empty);
const page = (body, head = '') =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8">${head}</head><body>${body}</body></html>`;

const pages = {
  // Server-rendered: content present without script, real form, no inline handlers.
  '/good.html': page(`<main><h1>Apply</h1><p>${'Body copy. '.repeat(20)}</p>
    <form action="/next" method="post"><button type="submit">Continue</button></form></main>`),
  '/self-submit.html':
    page(`<main><h1>Apply</h1><form method="post"><button>Continue</button></form>
    <form action="" id="empty-action"></form><button form="empty-action">Continue</button></main>`),
  '/no-submit.html':
    page(`<main><h1>Apply</h1><form action="/next"><button type="reset">Reset</button>
    <fieldset disabled><button>Continue</button></fieldset></form>
    <form action="javascript:submit()"><button>Continue</button></form></main>`),
  // Client-rendered: nothing without script, and the only submit path is a handler.
  '/spa.html': page(
    `<main><div id="app"></div>
     <button type="button" onclick="restart()">Start again</button></main>
     <script>document.getElementById('app').innerHTML =
       '<h1>Apply</h1><p>' + 'Body copy. '.repeat(20) + '</p>' +
       '<form><button type="button" onclick="submit()">Continue</button></form>';</script>`,
  ),
  // Behavioural component, correctly initialised (stands in for initAll()).
  '/wired.html': page(
    `<header data-govbb-module="header">Menu</header>
     <script>for (const el of document.querySelectorAll('[data-govbb-module]')) el.dataset.govbbInit = '';</script>`,
  ),
  // Declared but never initialised — initAll() missing.
  '/unwired.html': page(`<header data-govbb-module="header">Menu</header>`),
  // One recognised, one not — the typo case, which fails silently in a browser.
  '/typo.html': page(
    `<header data-govbb-module="header">Menu</header>
     <div data-govbb-module="headr">?</div>
     <script>document.querySelector('[data-govbb-module="header"]').dataset.govbbInit = '';</script>`,
  ),
  // No behavioural components at all — must pass, not error.
  '/plain.html': page(`<main><h1>Nothing behavioural here</h1></main>`),
  '/layout.html':
    page(`<a class="govbb-skip-link" href="#content">Skip to main content</a>
    <header>Service</header><main id="content" tabindex="-1"><h1>Apply</h1>
    <article><header>Section heading</header><footer>Section note</footer></article></main><footer>Government</footer>`),
  '/layout-child.html':
    page(`<a class="govbb-skip-link" href="#content">Skip to main content</a>
    <div role="banner">Service</div><div role="main"><h1 id="content" tabindex="-1">Apply</h1></div><div role="contentinfo">Government</div>`),
  '/layout-bad.html':
    page(`<a class="govbb-skip-link" href="#outside">Skip to main content</a>
    <header id="outside">Service</header><main><h1>Apply</h1><div style="width:2000px">Overflow</div></main>
    <main><h1>Duplicate</h1></main><footer>Government</footer>`),
};

const server = createServer((req, res) => {
  const body = pages[req.url.split('?')[0]];
  if (!body) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(body);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

/*
 * Must be async. spawnSync blocks this process's event loop, and the fixture
 * server lives in this process — so a synchronous child could never be served
 * and every browser-driven check would time out and "fail", regardless of what
 * the script under test actually does.
 */
const run = (script, args, options = {}) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [join(installed, script), ...args], {
      cwd,
      ...options,
    });
    let stdout = '',
      stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('close', (status) => resolve({ status, stdout, stderr }));
  });

console.log('\nConsumer dependency resolution');
{
  const missing = await run('module-check.mjs', [`${base}/plain.html`], {
    cwd: empty,
  });
  ok(
    "missing consumer dependency cannot use the skill author's dependencies",
    missing.status === 2 && /npm install -D playwright/.test(missing.stderr),
  );
  const noBrowser = await run('module-check.mjs', [`${base}/plain.html`], {
    env: {
      ...process.env,
      PLAYWRIGHT_BROWSERS_PATH: join(root, 'missing-browsers'),
    },
  });
  ok(
    'missing Chromium fails with installation instructions',
    noBrowser.status === 2 &&
      /npx playwright install chromium/.test(noBrowser.stderr),
  );
  const missingPage = await run('module-check.mjs', [`${base}/missing.html`]);
  ok(
    'a missing page cannot pass as having no modules',
    missingPage.status !== 0 && /HTTP 404/.test(missingPage.stderr),
  );
}

/* ---------- pe-check ---------- */
console.log('\npe-check.mjs — progressive enhancement');
{
  const good = await run('pe-check.mjs', [`${base}/good.html`]);
  ok(
    'server-rendered page passes',
    good.status === 0,
    (good.stdout.match(/\d+ chars with JS → \d+ without/) || [''])[0],
  );
  const selfSubmit = await run('pe-check.mjs', [`${base}/self-submit.html`]);
  ok(
    'omitted and empty form actions self-submit, including an external submit control',
    selfSubmit.status === 0,
    selfSubmit.stderr,
  );
  const noSubmit = await run('pe-check.mjs', [`${base}/no-submit.html`]);
  ok(
    'reset and disabled buttons cannot submit',
    noSubmit.status === 1 && /has no submit control/.test(noSubmit.stdout),
  );
  ok(
    'javascript form action fails without script',
    /has a javascript: action/.test(noSubmit.stdout),
  );

  const spa = await run('pe-check.mjs', [`${base}/spa.html`]);
  ok('client-rendered app fails', spa.status === 1);
  ok(
    '  … on the content check',
    /FAIL\s+Renders its content without JavaScript/.test(spa.stdout),
  );
  ok(
    '  … and names the inline handler',
    /inert without script/.test(spa.stdout),
  );
  ok(
    'reports the measurement, not just a verdict',
    /\d+ of \d+ characters survive/.test(spa.stdout),
  );
}

/* ---------- module-check ---------- */
console.log('\nmodule-check.mjs — behavioural wiring');
{
  const wired = await run('module-check.mjs', [`${base}/wired.html`]);
  ok('initialised component passes', wired.status === 0);

  const unwired = await run('module-check.mjs', [`${base}/unwired.html`]);
  ok('missing initAll() fails', unwired.status === 1);
  ok(
    '  … and says initAll() was never called',
    /initAll\(\) was never called/.test(unwired.stdout),
  );

  const typo = await run('module-check.mjs', [`${base}/typo.html`]);
  ok('unrecognised module name fails', typo.status === 1);
  ok(
    '  … distinguishes it from a missing initAll()',
    /unrecognised: "headr"/.test(typo.stdout) &&
      !/never called/.test(typo.stdout),
  );

  const plain = await run('module-check.mjs', [`${base}/plain.html`]);
  ok('page with no behavioural components passes', plain.status === 0);
  ok(
    '  … and says so rather than staying silent',
    /nothing to wire/.test(plain.stdout),
  );
}

console.log('\nlayout-check.mjs — semantic page structure');
{
  for (const path of ['layout.html', 'layout-child.html']) {
    const result = await run('layout-check.mjs', [`${base}/${path}`, '--json']);
    ok(
      `valid landmarks and focusable skip target pass: ${path}`,
      result.status === 0,
      result.stderr,
    );
  }
  const bad = await run('layout-check.mjs', [
    `${base}/layout-bad.html`,
    '--json',
  ]);
  const checks = JSON.parse(bad.stdout)[0].checks;
  ok('invalid layout fails', bad.status === 1);
  for (const name of [
    'Exactly one main landmark',
    'Exactly one h1',
    'Skip link targets main content',
    'Skip link target can receive focus',
    'No horizontal overflow at 360px',
  ]) {
    ok(
      `catches ${name.toLowerCase()}`,
      checks.some((check) => check.name === name && !check.passed),
    );
  }
}

/* ---------- audit-classes ---------- */
console.log('\naudit-classes.mjs — name resolution');
{
  // A stylesheet big enough to clear the refusal floor, with known contents.
  const classes = Array.from(
    { length: 50 },
    (_, i) => `.govbb-c${i}{color:red}`,
  ).join('');
  const tokens = Array.from(
    { length: 25 },
    (_, i) => `--govbb-t${i}:${i}px;`,
  ).join('');
  const css = `:root{${tokens}}${classes}.govbb-button{display:inline-flex}.govbb-list{margin:0}`;

  const mk = (name, files) => {
    const d = join(root, name);
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, 'govbb.css'), css);
    for (const [f, t] of Object.entries(files)) {
      mkdirSync(dirname(join(d, f)), { recursive: true });
      writeFileSync(join(d, f), t);
    }
    return d;
  };

  const clean = mk('clean', {
    'index.html': `<button class="govbb-button">Go</button><ul class="govbb-list"></ul>`,
    'service.css': `.my-thing{margin-top:var(--govbb-t3)}`,
  });
  const packageDir = join(consumer, 'node_modules/@govtech-bb/frontend');
  mkdirSync(packageDir, { recursive: true });
  writeFileSync(
    join(packageDir, 'package.json'),
    JSON.stringify({
      name: '@govtech-bb/frontend',
      exports: { './css': './styles.css' },
    }),
  );
  writeFileSync(join(packageDir, 'styles.css'), css);
  writeFileSync(
    join(cwd, 'index.html'),
    '<button class="govbb-button">Continue</button>',
  );
  const portable = await run('audit-classes.mjs', [cwd, '--json']);
  ok(
    'stylesheet resolves by package export from consumer workspace ancestor',
    portable.status === 0 &&
      JSON.parse(portable.stdout).stylesheet ===
        realpathSync(join(packageDir, 'styles.css')),
    portable.stderr,
  );
  const missingCss = await run('audit-classes.mjs', [
    clean,
    '--css',
    'missing.css',
  ]);
  ok(
    'missing explicit stylesheet fails rather than falling back',
    missingCss.status === 2 && /Could not read/.test(missingCss.stderr),
  );
  const r1 = await run('audit-classes.mjs', [
    clean,
    '--css',
    join(clean, 'govbb.css'),
  ]);
  ok(
    'clean output passes',
    r1.status === 0,
    (r1.stdout.match(/\d+ classes and \d+ tokens used[^\n]*/) || [''])[0],
  );

  const bad = mk('bad', {
    'index.html': `<div class="govbb-card"><span class="govbb-badge">New</span></div>`,
    'service.css': `.x{color:var(--govbb-color-primary)}\n.govbb-list{margin-top:2rem}`,
  });
  const r2 = await run('audit-classes.mjs', [
    bad,
    '--css',
    join(bad, 'govbb.css'),
  ]);
  ok('invented class fails', r2.status === 1 && /govbb-card/.test(r2.stdout));
  ok('undefined token fails', /govbb-color-primary/.test(r2.stdout));
  ok(
    'restyling a component is flagged',
    /restyle a component/.test(r2.stdout) && /\.govbb-list/.test(r2.stdout),
  );
  ok(
    'does not call unresolved names "invented"',
    /documentation conflict/.test(r2.stdout) &&
      !/\binvented name\b/.test(r2.stdout.split('documentation conflict')[0]),
  );

  // The failure mode that inverts the audit rather than weakening it.
  const tiny = mk('tiny', { 'index.html': `<b class="govbb-button">x</b>` });
  writeFileSync(join(tiny, 'govbb.css'), '.govbb-button{display:flex}');
  const r3 = await run('audit-classes.mjs', [
    tiny,
    '--css',
    join(tiny, 'govbb.css'),
  ]);
  ok(
    'refuses an implausible stylesheet rather than grading against it',
    r3.status === 2 && /Refusing/.test(r3.stderr),
  );

  // Vendored copies are not the run's own output.
  const vendored = mk('vendored', {
    'index.html': `<button class="govbb-button">Go</button>`,
    'node_modules/@govtech-bb/frontend/index.html': `<div class="govbb-totally-made-up"></div>`,
  });
  const r4 = await run('audit-classes.mjs', [
    vendored,
    '--css',
    join(vendored, 'govbb.css'),
  ]);
  ok(
    'ignores vendored trees',
    r4.status === 0 && !/totally-made-up/.test(r4.stdout),
  );
}

server.close();
rmSync(root, { recursive: true, force: true });
console.log(
  failures
    ? `\n${failures} failing assertion(s)\n`
    : '\nAll script tests passed\n',
);
process.exit(failures ? 1 : 0);
