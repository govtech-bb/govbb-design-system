#!/usr/bin/env node
/**
 * Progressive-enhancement wiring check for the design-system-compliance skill.
 *
 * Step 6 calls this "the single thing a conversion most reliably gets wrong":
 * markup that renders perfectly while every behavioural component is inert,
 * because `data-govbb-module` is missing or `initAll()` was never called. The
 * mobile navigation does not open, the number-input steppers do nothing, and
 * nothing about the page looks wrong — which is why it reaches users.
 *
 * `axe` cannot see it, because it is not a conformance failure. A class audit
 * cannot see it, because every class is real.
 *
 * The runtime leaves a signal. `initAll()` stamps each element it processes:
 *
 *     if ('govbbInit' in el.dataset) continue;
 *     const Module = registry[el.dataset.govbbModule];
 *     if (Module) { el.dataset.govbbInit = ''; new Module(el); }
 *
 * So after load, every [data-govbb-module] should carry [data-govbb-init], and
 * the two ways that fails say different things — see the checks below.
 *
 * This holds no inventory. It does not need to know which components are
 * behavioural: it reads what the page declares and asks whether the runtime
 * processed it, so adding a behavioural component obliges nobody to edit this.
 *
 * Do NOT check `data-govbb-header-enhanced` instead. Header returns early
 * without a toggle, so that attribute is legitimately absent on a logo-only
 * header that initialised perfectly well.
 *
 *   node module-check.mjs http://localhost:8102/ http://localhost:8102/form.html
 */

import { chromium } from 'playwright';

const HELP = `Usage:
  node module-check.mjs <url> [more urls…] [options]

Options:
  --json  Emit results as JSON
  -h, --help

Checks per page, with JavaScript enabled:
  · every [data-govbb-module] element was processed by initAll()
  · reports which module names are present, and which were not recognised

A page with no behavioural components passes trivially, and says so.
`;

const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help') || args.length === 0) {
  console.log(HELP);
  process.exit(args.length === 0 ? 2 : 0);
}
const asJson = args.includes('--json');
const urls = args.filter((a) => !a.startsWith('--'));

const browser = await chromium.launch();
const results = [];

for (const url of urls) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  /* initAll() usually runs from a module script, which executes after parsing;
     give it a beat rather than racing it. */
  await page.waitForTimeout(800);

  const found = await page.evaluate(() =>
    [...document.querySelectorAll('[data-govbb-module]')].map((el) => ({
      module: el.dataset.govbbModule,
      initialised: 'govbbInit' in el.dataset,
      tag: el.tagName.toLowerCase(),
    })),
  );
  await ctx.close();

  const checks = [];
  const add = (name, passed, evidence) =>
    checks.push({ name, passed, evidence });

  if (found.length === 0) {
    add(
      'Behavioural components are wired',
      true,
      'no [data-govbb-module] on this page — nothing to wire',
    );
    results.push({ url, modules: found, checks });
    continue;
  }

  const dead = found.filter((f) => !f.initialised);
  const live = found.filter((f) => f.initialised);

  /*
   * The two failures mean different things and want different fixes, so name
   * them separately rather than reporting "n not initialised".
   */
  if (dead.length === found.length) {
    add(
      'initAll() ran',
      false,
      `none of ${found.length} [data-govbb-module] element(s) was processed — initAll() was never called, or it threw before reaching them`,
    );
  } else {
    add('initAll() ran', true, `${live.length} of ${found.length} processed`);
    add(
      'Every module name is one the runtime recognises',
      dead.length === 0,
      dead.length
        ? `unrecognised: ${[...new Set(dead.map((d) => `"${d.module}" on <${d.tag}>`))].join(', ')} — a typo or a module the design system does not ship, which fails silently`
        : 'all recognised',
    );
  }

  results.push({ url, modules: found, checks });
}
await browser.close();

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  let failed = 0;
  for (const { url, modules, checks } of results) {
    const names = [...new Set(modules.map((m) => m.module))];
    console.log(
      `\n${url}${names.length ? `  modules: ${names.join(', ')}` : ''}`,
    );
    for (const c of checks) {
      if (!c.passed) failed++;
      console.log(
        `  ${c.passed ? 'ok  ' : 'FAIL'}  ${c.name}\n          ${c.evidence}`,
      );
    }
  }
  console.log(
    failed
      ? `\n${failed} check(s) failed across ${results.length} page(s)\n`
      : `\nAll checks passed across ${results.length} page(s)\n`,
  );
}
process.exit(results.some((r) => r.checks.some((c) => !c.passed)) ? 1 : 0);
