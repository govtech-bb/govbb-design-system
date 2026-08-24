#!/usr/bin/env node
/**
 * Progressive-enhancement check for the design-system-compliance skill.
 *
 * The design system is built on progressive enhancement, so "does this still
 * work with JavaScript off" is a real expectation rather than a nicety. It is
 * also the one question a conversion can get catastrophically wrong while
 * looking perfect: a client-rendered app renders nothing at all, and a form
 * whose only submit path is a click handler is simply dead.
 *
 * The failure is binary and total, which is why this is worth a script rather
 * than a paragraph. Measured on one real conversion, the numbers were 1527
 * characters with JavaScript against 481 without for the single-page app, and
 * 700 against 700 for the converted pages.
 *
 * What it cannot tell you: whether the no-JS experience is *good*. A page can
 * keep all its text and still lose the thing the user came to do. Read the
 * screenshots as well.
 *
 *   node pe-check.mjs http://localhost:8102/ http://localhost:8102/form.html
 *   node pe-check.mjs http://localhost:8102/ --min-ratio 0.9
 */

import { chromium } from 'playwright';

const HELP = `Usage:
  node pe-check.mjs <url> [more urls…] [options]

Options:
  --min-ratio <n>  Fraction of the JS-on text that must survive with JS off
                   (default 0.8). A client-rendered app scores near zero.
  --json           Emit results as JSON
  -h, --help

Checks per page, with JavaScript disabled:
  · the page still renders its content
  · every form can submit without script (has an action, and a submit control)
  · no control depends on an inline handler alone
`;

const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help') || args.length === 0) {
  console.log(HELP);
  process.exit(args.length === 0 ? 2 : 0);
}
const asJson = args.includes('--json');
const ri = args.indexOf('--min-ratio');
const minRatio = ri !== -1 && args[ri + 1] ? Number(args[ri + 1]) : 0.8;
if (!(minRatio > 0 && minRatio <= 1)) {
  console.error('--min-ratio must be between 0 and 1');
  process.exit(2);
}
const urls = args.filter(
  (a, i) => !a.startsWith('--') && args[i - 1] !== '--min-ratio',
);

const browser = await chromium.launch();

/** Load once at a given JS policy and record what the page amounts to. */
async function load(url, javaScriptEnabled) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    javaScriptEnabled,
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const snapshot = await page.evaluate(() => {
    const forms = [...document.querySelectorAll('form')].map((f) => ({
      action: f.getAttribute('action'),
      method: (f.getAttribute('method') || 'get').toLowerCase(),
      hasSubmit: Boolean(
        f.querySelector('button:not([type=button]), input[type=submit]'),
      ),
    }));
    return {
      text: (document.body?.innerText || '').trim().length,
      forms,
      inlineHandlers: document.querySelectorAll('[onclick]').length,
      links: document.querySelectorAll('a[href]').length,
    };
  });
  await ctx.close();
  return snapshot;
}

const results = [];
for (const url of urls) {
  const on = await load(url, true);
  const off = await load(url, false);
  const checks = [];
  const add = (name, passed, evidence) =>
    checks.push({ name, passed, evidence });

  const ratio = on.text === 0 ? 1 : off.text / on.text;
  add(
    'Renders its content without JavaScript',
    ratio >= minRatio,
    `${off.text} of ${on.text} characters survive (${Math.round(ratio * 100)}%, floor ${Math.round(minRatio * 100)}%)`,
  );

  /*
   * Judged on the no-JS render, because that is the DOM a user without script
   * actually gets — a form injected by JavaScript is not there to submit.
   */
  const broken = off.forms.filter((f) => !f.action || !f.hasSubmit);
  add(
    'Every form can submit without script',
    broken.length === 0,
    off.forms.length === 0
      ? 'no forms on this page'
      : broken.length
        ? broken
            .map(
              (f) =>
                `form ${!f.action ? 'has no action' : ''}${!f.action && !f.hasSubmit ? ' and ' : ''}${!f.hasSubmit ? 'has no submit control' : ''}`,
            )
            .join('; ')
        : `${off.forms.length} form(s), all submittable`,
  );

  add(
    'No control depends on an inline handler alone',
    off.inlineHandlers === 0,
    off.inlineHandlers
      ? `${off.inlineHandlers} element(s) with onclick — inert without script`
      : 'none',
  );

  results.push({ url, jsOn: on.text, jsOff: off.text, checks });
}
await browser.close();

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  let failed = 0;
  for (const { url, jsOn, jsOff, checks } of results) {
    console.log(`\n${url}  ${jsOn} chars with JS → ${jsOff} without`);
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
