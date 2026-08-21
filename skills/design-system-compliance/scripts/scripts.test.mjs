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
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
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
const page = (body, head = '') =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8">${head}</head><body>${body}</body></html>`;

const pages = {
  // Server-rendered: content present without script, real form, no inline handlers.
  '/good.html': page(`<main><h1>Apply</h1><p>${'Body copy. '.repeat(20)}</p>
    <form action="/next" method="post"><button type="submit">Continue</button></form></main>`),
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
const run = (script, args) =>
  new Promise((resolve) => {
    const child = spawn('node', [join(HERE, script), ...args]);
    let stdout = '',
      stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('close', (status) => resolve({ status, stdout, stderr }));
  });

/* ---------- pe-check ---------- */
console.log('\npe-check.mjs — progressive enhancement');
{
  const good = await run('pe-check.mjs', [`${base}/good.html`]);
  ok(
    'server-rendered page passes',
    good.status === 0,
    (good.stdout.match(/\d+ chars with JS → \d+ without/) || [''])[0],
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
