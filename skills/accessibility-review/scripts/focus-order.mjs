#!/usr/bin/env node
/**
 * Keyboard focus walk for the accessibility-review skill.
 *
 * Tabs through a page and records the focus order, then flags what is tedious
 * and error-prone to check by hand:
 *
 *   - focus traps (the same element twice running, by node identity)
 *   - focus dropped mid-walk back to the document body
 *   - focused elements scrolled or positioned out of view
 *   - focused elements covered at their centre by another element, such as a
 *     sticky header — easy to miss by hand
 *   - positive tabindex
 *
 * Deliberately does not judge whether focus is visible, automate Shift+Tab
 * comparison or look inside iframes — all three produce false alarms from out
 * here, and a check that cries wolf is worse than an honest
 * `needs-manual-test`.
 *
 *   node focus-order.mjs http://localhost:4321/ --max-tabs 40
 */

import { launchBrowser } from './project.mjs';

const HELP = `Usage:
  node focus-order.mjs <url> [options]

Options:
  --max-tabs <n>   How many Tab presses to make (default 50)
  --viewport <WxH> Viewport size (default 1280x800; try 360x640 for mobile)
  --wait <ms>      Settle time after load (default 500)
  -h, --help
`;

function parseArgs(argv) {
  const o = { maxTabs: 50, wait: 500, width: 1280, height: 800 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') o.help = true;
    else if (a === '--max-tabs') o.maxTabs = Number(argv[++i]);
    else if (a === '--wait') o.wait = Number(argv[++i]);
    else if (a === '--viewport') {
      const [w, h] = argv[++i].split('x').map(Number);
      o.width = w;
      o.height = h;
    } else o.url = a;
  }
  return o;
}

/** Runs in the page. Describes the active element and where it sits.
 *
 *  Identity matters more than it looks: two different nav links can both
 *  serialise to `a` with no id or class, so comparing descriptions would report
 *  a focus trap every time a page has two unstyled links. We keep the actual
 *  nodes in a page-level array and report revisits by index instead. */
const DESCRIBE = () => {
  const el = document.activeElement;
  if (!el || el === document.body || el === document.documentElement)
    return { leftDocument: true };

  window.__focusWalk = window.__focusWalk || [];
  const seenAt = window.__focusWalk.indexOf(el);
  const revisitOf = seenAt === -1 ? null : seenAt;
  if (seenAt === -1) window.__focusWalk.push(el);

  const rect = el.getBoundingClientRect();

  const name = (
    el.getAttribute('aria-label') ||
    (el.labels && el.labels.length ? el.labels[0].textContent : '') ||
    el.getAttribute('title') ||
    el.getAttribute('alt') ||
    (el.value && el.type === 'submit' ? el.value : '') ||
    el.textContent ||
    ''
  )
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 70);

  // getAttribute('class') rather than .className: on SVG elements .className
  // is an SVGAnimatedString, not a string.
  const elClass = el.getAttribute('class');
  const selector =
    el.tagName.toLowerCase() +
    (el.id ? `#${el.id}` : '') +
    (elClass ? '.' + elClass.trim().split(/\s+/).slice(0, 2).join('.') : '');

  const inViewport =
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < innerHeight &&
    rect.left < innerWidth;

  // Is the focused element covered at its own centre by something else?
  let obscuredBy = null;
  if (inViewport) {
    const x = Math.min(Math.max(rect.left + rect.width / 2, 1), innerWidth - 1);
    const y = Math.min(
      Math.max(rect.top + rect.height / 2, 1),
      innerHeight - 1,
    );
    const top = document.elementFromPoint(x, y);
    if (top && top !== el && !el.contains(top) && !top.contains(el)) {
      const topClass = top.getAttribute('class');
      obscuredBy =
        top.tagName.toLowerCase() +
        (top.id ? `#${top.id}` : '') +
        (topClass ? '.' + topClass.trim().split(/\s+/)[0] : '');
    }
  }

  return {
    selector,
    name,
    revisitOf,
    // Focus moving *into* an iframe leaves activeElement on the frame itself in
    // this document, so repeated Tabs look identical from out here. Flagged so
    // the walk reports a boundary instead of inventing a focus trap.
    isFrame: el.tagName === 'IFRAME',
    role: el.getAttribute('role') || null,
    tabindex: el.getAttribute('tabindex'),
    disabled: el.disabled === true,
    inViewport,
    obscuredBy,
  };
};

/** Tab through the page. Stops on a trap (same node twice running) or once the
 *  order cycles back to somewhere already visited, which is a normal wrap and
 *  means we have seen the whole order. */
async function walk(page, key, maxTabs) {
  await page.evaluate(() => {
    window.__focusWalk = [];
  });
  const seq = [];
  let trapped = false;
  let wrappedTo = null;
  let enteredFrame = null;
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press(key);
    const d = await page.evaluate(DESCRIBE);
    // Focus outside the document usually means the end of the tab ring; keep
    // going so we can tell a wrap from focus genuinely being dropped.
    if (d.leftDocument) {
      seq.push(d);
      continue;
    }
    if (d.revisitOf !== null) {
      const prev = seq.filter((s) => !s.leftDocument).at(-1);
      const sameAsPrevious = prev && prev.index === d.revisitOf;
      if (sameAsPrevious && d.isFrame) {
        // Focus went inside the frame. Not a trap — just past what we can see.
        enteredFrame = d.selector;
      } else if (sameAsPrevious) {
        trapped = true;
        seq.push({ ...d, index: d.revisitOf });
      } else {
        wrappedTo = d.revisitOf;
      }
      break;
    }
    seq.push({ ...d, index: seq.filter((s) => !s.leftDocument).length });
  }
  return {
    seq,
    trapped,
    wrappedTo,
    enteredFrame,
    exhausted: seq.length >= maxTabs,
  };
}

const opts = parseArgs(process.argv.slice(2));
if (opts.help || !opts.url) {
  console.log(HELP);
  process.exit(opts.help ? 0 : 1);
}

const browser = await launchBrowser();
try {
  const page = await browser.newPage({
    viewport: { width: opts.width, height: opts.height },
  });
  const response = await page.goto(opts.url, {
    waitUntil: 'networkidle',
    timeout: 30_000,
  });
  if (response && !response.ok())
    throw new Error(`HTTP ${response.status()} at ${opts.url}`);
  if (opts.wait) await page.waitForTimeout(opts.wait);

  console.log(`# Focus walk: ${opts.url}`);
  console.log(
    `Viewport ${opts.width}×${opts.height}, up to ${opts.maxTabs} tabs\n`,
  );

  const walkResult = await walk(page, 'Tab', opts.maxTabs);
  const forward = walkResult.seq;

  console.log('| # | Element | Accessible name | Notes |');
  console.log('|---|---|---|---|');
  forward.forEach((d, i) => {
    if (d.leftDocument) {
      console.log(
        `| ${i + 1} | *(focus left the document)* | | end of tab ring, or focus dropped |`,
      );
      return;
    }
    const notes = [];
    if (!d.inViewport) notes.push('**out of view**');
    if (d.obscuredBy) notes.push(`**obscured by \`${d.obscuredBy}\`**`);
    if (d.disabled) notes.push('disabled but focusable');
    if (d.tabindex && Number(d.tabindex) > 0)
      notes.push(`positive tabindex=${d.tabindex}`);
    if (d.isFrame) notes.push('iframe — walk cannot see inside');
    console.log(
      `| ${i + 1} | \`${d.selector}\` | ${d.name || '*(none)*'} | ${notes.join('; ') || ''} |`,
    );
  });

  // Summary of the things worth acting on.
  const real = forward.filter((d) => !d.leftDocument);
  const problems = [];
  const notes = [];

  if (walkResult.trapped) {
    const last = real.at(-1);
    problems.push(
      `**Focus trap:** focus stayed on \`${last?.selector}\` across two consecutive Tab presses. A keyboard user cannot get past it.`,
    );
  } else if (walkResult.wrappedTo !== null) {
    notes.push(
      `Tab order cycled back to element ${walkResult.wrappedTo + 1} after ${real.length} stops — the full order was captured.`,
    );
  } else if (walkResult.exhausted) {
    notes.push(
      `Hit the ${opts.maxTabs}-tab limit without completing the cycle. Re-run with a higher \`--max-tabs\` to see the rest.`,
    );
  }

  if (walkResult.enteredFrame)
    notes.push(
      `Focus entered \`${walkResult.enteredFrame}\` at stop ${real.length} and the walk stopped there — this script cannot see inside an iframe. Tab through the embedded content by hand, and check that focus can get back out.`,
    );

  // Focus leaving the document mid-walk (with stops after it) is different from
  // leaving at the very end, which is just the edge of the tab ring.
  // Leaving the document and coming back is normal when the ring wraps through
  // browser chrome, so only flag it when the walk did NOT detect a wrap —
  // otherwise this fires on almost every page and stops being worth reading.
  const leftAt = forward.findIndex((d) => d.leftDocument);
  if (
    leftAt !== -1 &&
    leftAt < forward.length - 1 &&
    walkResult.wrappedTo === null
  )
    problems.push(
      `Focus left the document at step ${leftAt + 1} and then resumed. Mid-walk focus loss usually means an element was hidden or removed while it held focus — the person is dropped back to the top of the page.`,
    );

  const obscured = real.filter((d) => d.obscuredBy);
  if (obscured.length)
    problems.push(
      `${obscured.length} focused element(s) covered at their centre by another element. Check whether the covering element stays on screen, such as a sticky header or cookie banner, and how much of the focused element it hides.`,
    );
  const offscreen = real.filter((d) => !d.inViewport);
  if (offscreen.length)
    problems.push(
      `${offscreen.length} focused element(s) were outside the viewport. If the page does not scroll them into view, a sighted keyboard user cannot see where they are.`,
    );
  const positive = real.filter((d) => d.tabindex && Number(d.tabindex) > 0);
  if (positive.length)
    problems.push(
      `${positive.length} element(s) use a positive tabindex, which overrides DOM order and reliably desynchronises tab order from reading order.`,
    );

  console.log('\n## Flags\n');
  if (problems.length === 0)
    console.log('None of the automated checks flagged a problem.\n');
  else for (const p of problems) console.log(`- ${p}`);
  for (const n of notes) console.log(`- ${n}`);

  console.log(
    '\n---\nWhat this walk cannot tell you, and must stay `judgement` or\n' +
      '`needs-manual-test` in the review:\n' +
      '  - whether tab order matches *reading* order\n' +
      '  - whether focus is visible at each stop, and whether the indicator\n' +
      '    contrasts with its own backdrop (contrast.mjs)\n' +
      '  - anything inside an iframe, or how any of it is announced\n' +
      '  - backwards (Shift+Tab) traversal — deliberately not automated here,\n' +
      '    because a start-position difference makes the comparison unreliable\n' +
      '    enough to cry wolf. Check it by hand.',
  );
} finally {
  await browser.close();
}
