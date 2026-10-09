#!/usr/bin/env node
/**
 * Runs one journey through a service once per persona, in parallel, and records
 * what each persona could actually see and do.
 *
 * Each persona is a *constraint*, not a personality — a viewport, a JavaScript
 * policy, a network state. A caricature ("impatient Bob") produces caricatured
 * findings; a constraint produces reproducible ones. Every persona gets its own
 * isolated browser context, so nothing one does leaks into another's session
 * and no collision can masquerade as a finding.
 *
 * The output is evidence, not judgement. This script records where a step
 * failed, what the accessibility tree exposed, and what was on screen. Deciding
 * whether that is a problem is the reviewer's job — which is why every
 * observation carries the step that produced it and a screenshot you can look
 * at.
 *
 * Two limits are written into the output on purpose, because both are easy to
 * overclaim and neither is measurable from here:
 *
 *   - The `js-blocked` and `offline` personas test exactly that. Nothing here
 *     throttles bandwidth, so no result supports "works on a slow connection".
 *   - `ariaSnapshot()` returns the accessibility *tree*. It shows whether a
 *     name, role or state is exposed at all. It cannot tell you announcement
 *     order, live-region behaviour or verbosity — only a person with a real
 *     screen reader can.
 *
 *   node persona-run.mjs https://example.gov.bb/apply --journey journey.json
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const HELP = `Usage:
  node persona-run.mjs <url> [options]

Options:
  --journey <file>   JSON array of steps (see below). Without one, each persona
                     loads the page and looks, which is a thin critique.
  --task <text>      What the user is trying to do, recorded with the results
                     so a finding can be read against an intent.
  --personas <list>  Comma-separated subset (default: all six)
  --out <dir>        Where to write screenshots and observations
                     (default: ./critique-run)
  --wait <ms>        Settle time after each step (default 500)
  --list-personas    Print the personas and what each one can and cannot show
  -h, --help

Journey steps:
  {"do":"click","role":"button","name":"Start now"}
  {"do":"click","text":"Continue"}
  {"do":"fill","label":"National ID number","value":"123456-7890"}
  {"do":"press","key":"Enter"}
  {"do":"goto","url":"https://…"}
  {"do":"look","note":"check-answers page"}

A step that fails is recorded and the persona carries on. Failure is the point:
"the JS-blocked persona could not get past step 2" is the finding.
`;

/*
 * The six personas from the design-critique plan. Each carries `tests` and
 * `cannotConclude` so the honest limits travel with the data rather than living
 * only in a report template someone might not read.
 */
const PERSONAS = {
  'first-time-older-user': {
    label: 'First-time older user',
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    fontScale: 1.5,
    tests:
      'unfamiliar journey at an enlarged text size; jargon and irreversible steps',
    cannotConclude:
      'anything about age itself — this is a text-scale and unfamiliarity proxy',
  },
  'confident-repeat-user': {
    label: 'Confident repeat user',
    viewport: { width: 1440, height: 900 },
    tests: 'speed, shortcuts, whether explanation can be skipped',
    cannotConclude: 'real abandonment rates',
  },
  'small-screen-mobile-user': {
    label: 'Small-screen mobile user',
    viewport: { width: 360, height: 640 },
    isMobile: true,
    hasTouch: true,
    tests: 'reflow, thumb reach, content lost below the fold at 360px',
    cannotConclude:
      'on-screen keyboard occlusion — no real soft keyboard is present',
  },
  'js-blocked-user': {
    label: 'JavaScript-blocked user',
    viewport: { width: 1280, height: 800 },
    javaScriptEnabled: false,
    tests: 'whether the progressive-enhancement path holds with no JS at all',
    cannotConclude:
      'behaviour on a slow connection — nothing here is throttled',
  },
  'offline-user': {
    label: 'Interrupted / offline user',
    viewport: { width: 1280, height: 800 },
    offline: true,
    tests: 'what happens when the network drops mid-journey',
    cannotConclude:
      'behaviour on a slow connection — nothing here is throttled',
  },
  'screen-reader-user': {
    label: 'Screen reader user',
    viewport: { width: 1280, height: 800 },
    captureTree: true,
    tests:
      'whether names, roles, states and errors are exposed in the accessibility tree at all',
    cannotConclude:
      'announcement order, live-region behaviour or verbosity — that needs a real screen reader',
  },
};

function parseArgs(argv) {
  const o = {
    wait: 500,
    out: './critique-run',
    personas: Object.keys(PERSONAS),
  };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') o.help = true;
    else if (a === '--list-personas') o.list = true;
    else if (a === '--journey') o.journey = argv[++i];
    else if (a === '--task') o.task = argv[++i];
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--wait') o.wait = Number(argv[++i]);
    else if (a === '--personas')
      o.personas = argv[++i].split(',').map((s) => s.trim());
    else rest.push(a);
  }
  o.url = rest[0];
  return o;
}

const opts = parseArgs(process.argv.slice(2));

if (opts.help) {
  console.log(HELP);
  process.exit(0);
}
if (opts.list) {
  for (const [key, p] of Object.entries(PERSONAS)) {
    console.log(`\n${key} — ${p.label}`);
    console.log(`  tests:  ${p.tests}`);
    console.log(`  cannot: ${p.cannotConclude}`);
  }
  console.log();
  process.exit(0);
}
if (!opts.url) {
  console.error(HELP);
  process.exit(2);
}

const unknown = opts.personas.filter((p) => !PERSONAS[p]);
if (unknown.length) {
  console.error(
    `unknown persona(s): ${unknown.join(', ')}\nRun --list-personas to see the six.`,
  );
  process.exit(2);
}

let journey = [{ do: 'look', note: 'landing' }];
if (opts.journey) {
  if (!existsSync(opts.journey)) {
    console.error(`journey file not found: ${opts.journey}`);
    process.exit(2);
  }
  journey = JSON.parse(readFileSync(opts.journey, 'utf8'));
  if (!Array.isArray(journey)) {
    console.error('journey file must contain a JSON array of steps');
    process.exit(2);
  }
}

/* Resolve a step to a locator. Prefer role+name: it is what an assistive
   technology would use to find the control, so a step that cannot be resolved
   this way is itself worth knowing about. */
function locate(page, step) {
  if (step.role)
    return page.getByRole(step.role, { name: step.name, exact: false });
  if (step.label) return page.getByLabel(step.label, { exact: false });
  if (step.text) return page.getByText(step.text, { exact: false }).first();
  if (step.selector) return page.locator(step.selector).first();
  return null;
}

async function runStep(page, step, wait) {
  const target = locate(page, step);
  switch (step.do) {
    case 'goto':
      await page.goto(step.url, { waitUntil: 'domcontentloaded' });
      break;
    case 'click':
      await target.click({ timeout: 5000 });
      break;
    case 'fill':
      await target.fill(String(step.value ?? ''), { timeout: 5000 });
      break;
    case 'press':
      await page.keyboard.press(step.key);
      break;
    case 'look':
      break;
    default:
      throw new Error(`unknown step type: ${step.do}`);
  }
  await page.waitForTimeout(wait);
}

/*
 * An action can succeed while the journey fails. Clicking a link is a success
 * even when the navigation it triggers lands on the browser's own error page —
 * which is exactly what the offline persona does, and reporting that as
 * "completed the journey" is a green light over a dead end. Judge the step by
 * where the persona ended up, not by whether the click threw.
 */
function navigationFailure(url) {
  if (url.startsWith('chrome-error://'))
    return 'navigation failed — browser error page, the service showed nothing of its own';
  if (url === 'about:blank')
    return 'navigation left the persona on a blank page';
  return null;
}

async function observe(page, persona, dir, index, step, outcome) {
  const shot = join(dir, `step-${index}.png`);
  /* Screenshots can fail on a page that never loaded (offline persona), which
     is a legitimate state rather than a script error. */
  const shotOk = await page
    .screenshot({ path: shot, fullPage: false })
    .then(() => true)
    .catch(() => false);

  const tree = persona.captureTree
    ? await page
        .locator('body')
        .ariaSnapshot()
        .catch(() => null)
    : null;

  const heading = await page
    .locator('h1')
    .first()
    .textContent()
    .catch(() => null);

  const focused = await page
    .evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return null;
      return `${a.tagName.toLowerCase()}${a.textContent ? ` "${a.textContent.trim().slice(0, 40)}"` : ''}`;
    })
    .catch(() => null);

  return {
    step: index,
    action: step,
    outcome,
    url: page.url(),
    h1: heading?.trim() ?? null,
    focusedAfter: focused,
    screenshot: shotOk ? shot : null,
    ariaTree: tree,
  };
}

async function runPersona(browser, key, outRoot, task) {
  const persona = PERSONAS[key];
  const dir = join(outRoot, key);
  mkdirSync(dir, { recursive: true });

  const context = await browser.newContext({
    viewport: persona.viewport,
    isMobile: persona.isMobile ?? false,
    hasTouch: persona.hasTouch ?? false,
    javaScriptEnabled: persona.javaScriptEnabled ?? true,
    deviceScaleFactor: persona.deviceScaleFactor,
  });

  const consoleErrors = [];
  const page = await context.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200));
  });
  page.on('pageerror', (e) => consoleErrors.push(String(e).slice(0, 200)));

  /* Enlarged text is a real constraint for the older-user persona and the one
     most services break under, because it forces reflow the designer never saw. */
  if (persona.fontScale)
    await context.addInitScript((s) => {
      document.documentElement.style.fontSize = `${16 * s}px`;
    }, persona.fontScale);

  const observations = [];
  let stoppedAt = null;

  try {
    await page.goto(opts.url, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
    await page.waitForTimeout(opts.wait);
  } catch (e) {
    observations.push({
      step: 0,
      action: { do: 'goto', url: opts.url },
      outcome: { ok: false, error: String(e.message ?? e).split('\n')[0] },
      url: opts.url,
      h1: null,
      focusedAfter: null,
      screenshot: null,
      ariaTree: null,
    });
    stoppedAt = 0;
  }

  /* Go offline only after the first load, so the persona models an
     interruption mid-journey rather than never having reached the service. */
  if (persona.offline && stoppedAt === null) await context.setOffline(true);

  if (stoppedAt === null) {
    for (let i = 0; i < journey.length; i++) {
      const step = journey[i];
      let outcome = { ok: true };
      try {
        await runStep(page, step, opts.wait);
      } catch (e) {
        outcome = { ok: false, error: String(e.message ?? e).split('\n')[0] };
      }
      /* The action may have worked while the journey did not. */
      const navFailed = navigationFailure(page.url());
      if (outcome.ok && navFailed) outcome = { ok: false, error: navFailed };
      observations.push(
        await observe(page, persona, dir, i + 1, step, outcome),
      );
      if (!outcome.ok && stoppedAt === null) stoppedAt = i + 1;
    }
  }

  await context.close();

  const result = {
    persona: key,
    label: persona.label,
    tests: persona.tests,
    cannotConclude: persona.cannotConclude,
    task: task ?? null,
    startUrl: opts.url,
    stoppedAtStep: stoppedAt,
    consoleErrors: [...new Set(consoleErrors)],
    observations,
  };
  writeFileSync(
    join(dir, 'observations.json'),
    JSON.stringify(result, null, 2),
  );
  return result;
}

mkdirSync(opts.out, { recursive: true });
const browser = await chromium.launch();
const started = Date.now();

const results = await Promise.all(
  opts.personas.map((key) => runPersona(browser, key, opts.out, opts.task)),
);

await browser.close();

const summary = {
  url: opts.url,
  task: opts.task ?? null,
  steps: journey.length,
  ranAt: new Date().toISOString(),
  durationMs: Date.now() - started,
  notTested: [
    'connection speed — no bandwidth throttling was applied, so no result supports a claim about slow connections',
    'screen reader output — the accessibility tree shows what is exposed, not what is announced or in what order',
    'on-screen keyboard occlusion — no soft keyboard is present in a headless browser',
  ],
  personas: results.map((r) => ({
    persona: r.persona,
    stoppedAtStep: r.stoppedAtStep,
    consoleErrors: r.consoleErrors.length,
  })),
};
writeFileSync(join(opts.out, 'summary.json'), JSON.stringify(summary, null, 2));

console.log(
  `\n${results.length} personas · ${journey.length} step(s) · ${summary.durationMs}ms\n`,
);
for (const r of results) {
  const status =
    r.stoppedAtStep === null
      ? 'completed the journey'
      : `STOPPED at step ${r.stoppedAtStep} — ${r.observations.find((o) => !o.outcome.ok)?.outcome.error ?? 'unknown'}`;
  console.log(`  ${r.persona.padEnd(26)} ${status}`);
  if (r.consoleErrors.length)
    console.log(
      `  ${''.padEnd(26)} ${r.consoleErrors.length} console error(s)`,
    );
}
console.log(`\nWrote ${opts.out}/summary.json and one directory per persona.`);
console.log(
  'Not tested: connection speed, screen reader announcement, keyboard occlusion.\n',
);
