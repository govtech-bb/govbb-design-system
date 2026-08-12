#!/usr/bin/env node
/**
 * Page-structure checks for the design-system-compliance skill.
 *
 * Every problem this finds is invisible to a class audit and to looking at a
 * screenshot, because none of them is a class error and none of them changes
 * how the page looks. They are all about where things sit relative to the
 * landmarks — which is exactly the class of defect that reaches users, since
 * the page renders perfectly the whole time.
 *
 * The one that motivated this script: a back link placed first inside
 * `<main id="main-content">` means a keyboard user who activates "Skip to main
 * content" lands on navigation — the thing they just asked to skip. Correct
 * classes, correct styling, defeated skip link.
 *
 * Checks run against the rendered DOM, not the source, so they see what a
 * template actually produced.
 *
 *   node layout-check.mjs http://localhost:8102/ http://localhost:8102/form.html
 *   node layout-check.mjs http://localhost:8102/ --widths 360,1280
 */

import { chromium } from 'playwright';

const HELP = `Usage:
  node layout-check.mjs <url> [more urls…] [options]

Options:
  --widths <list>  Comma-separated viewport widths (default 360,1280)
  --json           Emit results as JSON
  -h, --help

Checks per page:
  · exactly one h1
  · the skip link's href resolves to an element that exists
  · main carries that id, and is focusable (tabindex="-1")
  · the first focusable element inside main does not leave the page
  · one each of banner / main / contentinfo landmarks
  · body content sits inside a grid column, not loose in the wrapper
  · no horizontal overflow at any width
`;

const args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help') || args.length === 0) {
  console.log(HELP);
  process.exit(args.length === 0 ? 2 : 0);
}
const asJson = args.includes('--json');
let widths = [360, 1280];
const wi = args.indexOf('--widths');
if (wi !== -1 && args[wi + 1]) widths = args[wi + 1].split(',').map(Number);
const urls = args.filter(
  (a, i) => !a.startsWith('--') && args[i - 1] !== '--widths',
);

const browser = await chromium.launch();

/* Structure is width-independent, so it is checked once at the first width;
   only overflow is re-checked at each width. */
async function structure(page) {
  return page.evaluate(() => {
    const out = [];
    const add = (name, passed, evidence) =>
      out.push({ name, passed, evidence });
    const q = (s) => document.querySelector(s);
    const qa = (s) => [...document.querySelectorAll(s)];

    const h1s = qa('h1');
    add('Exactly one h1', h1s.length === 1, `${h1s.length} found`);

    const skip = q('.govbb-skip-link, a[href^="#"][class*="skip"]');
    const targetId = skip
      ? (skip.getAttribute('href') || '').replace(/^#/, '')
      : null;
    const target = targetId ? document.getElementById(targetId) : null;
    add(
      'Skip link points at an element that exists',
      Boolean(skip && target),
      !skip
        ? 'no skip link found'
        : target
          ? `#${targetId}`
          : `#${targetId} does not exist`,
    );

    const main = q('main');
    add(
      'Page has a main landmark',
      Boolean(main),
      main ? 'present' : 'missing',
    );
    add(
      'main is the skip link target',
      Boolean(main && target && main === target),
      !main || !target
        ? 'cannot check'
        : main === target
          ? 'yes'
          : `target is <${target.tagName.toLowerCase()}>, not main`,
    );
    add(
      'main is focusable (tabindex="-1")',
      Boolean(main && main.getAttribute('tabindex') === '-1'),
      main
        ? `tabindex=${main.getAttribute('tabindex') ?? 'absent'}`
        : 'no main',
    );

    /*
     * The heart of it. A link inside main whose href leaves the current page,
     * appearing before the h1, is navigation sitting in the skip target.
     */
    if (main) {
      const focusables = [
        ...main.querySelectorAll('a[href], button, input, select, textarea'),
      ].filter((el) => el.offsetHeight > 0 && !el.hasAttribute('disabled'));
      const first = focusables[0];
      const h1 = main.querySelector('h1');
      const beforeH1 =
        first &&
        h1 &&
        first.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING;
      const leaves =
        first &&
        first.tagName === 'A' &&
        !(first.getAttribute('href') || '').startsWith('#');
      add(
        'First thing inside main is not a link away from the page',
        !(beforeH1 && leaves),
        first
          ? beforeH1 && leaves
            ? `<a href="${first.getAttribute('href')}">${first.textContent.trim().slice(0, 30)}</a> precedes the h1 — a skip-link user lands here`
            : `first focusable: <${first.tagName.toLowerCase()}>`
          : 'nothing focusable in main',
      );
    }

    for (const [role, sel] of [
      ['banner', 'header, [role=banner]'],
      ['contentinfo', 'footer, [role=contentinfo]'],
    ]) {
      const n = qa(sel).length;
      add(`Exactly one ${role} landmark`, n === 1, `${n} found`);
    }

    if (main) {
      const h1 = main.querySelector('h1');
      add(
        'Body content sits inside a grid column',
        Boolean(h1 && h1.closest('[class*="govbb-grid-column"]')),
        h1
          ? h1.closest('[class*="govbb-grid-column"]')
            ? 'yes'
            : 'h1 is not inside a govbb-grid-column-* — content is loose in the wrapper'
          : 'no h1 in main',
      );
    }
    return out;
  });
}

const results = [];
for (const url of urls) {
  const page = await (
    await browser.newContext({ viewport: { width: widths[0], height: 900 } })
  ).newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  const checks = await structure(page);
  await page.context().close();

  for (const w of widths) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: 900 },
    });
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(400);
    const over = await p.evaluate(
      (w) => ({ scroll: document.documentElement.scrollWidth, view: w }),
      w,
    );
    checks.push({
      name: `No horizontal overflow at ${w}px`,
      passed: over.scroll <= over.view + 1,
      evidence: `content ${over.scroll}px in a ${over.view}px viewport`,
    });
    await ctx.close();
  }
  results.push({ url, checks });
}
await browser.close();

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  let failed = 0;
  for (const { url, checks } of results) {
    console.log(`\n${url}`);
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
