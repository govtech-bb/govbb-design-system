/*
 * Tests for the grader.
 *
 * The grader is a measuring instrument, and until this file existed nothing
 * measured it. That is not a hypothetical worry: six separate checks in this
 * harness were found passing while examining the wrong thing — a layout
 * reproducer run against an unstyled page, a focus walk counting a transparent
 * shadow, a comparison of two empty sets, a trap assertion matching strings
 * nobody typed, and a fixture that handed over its own answer key. Every one of
 * them failed silently, and the eval it fed reported a confident zero delta.
 *
 * So the tests below are not unit tests of regex behaviour. Each one replays a
 * failure that actually happened and asserts the grader now separates the two
 * configurations it previously scored identically.
 *
 *   node evals/design-system-compliance/grade.test.mjs
 *
 * Needs packages/frontend/dist/govbb.css built, same as the grader.
 */

import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const HERE = dirname(fileURLToPath(import.meta.url));
const GRADER = join(HERE, 'grade.mjs');

let failures = 0;
const ok = (name, passed, detail = '') => {
  console.log(
    `  ${passed ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`,
  );
  if (!passed) failures++;
};

/** Write {relative path: contents} into a fresh iteration dir and grade it. */
function grade(evalName, trees, env = {}) {
  const iter = mkdtempSync(join(tmpdir(), 'govbb-grade-test-'));
  for (const [cfg, files] of Object.entries(trees))
    for (const [rel, text] of Object.entries(files)) {
      const p = join(iter, `eval-${evalName}`, cfg, 'outputs', rel);
      mkdirSync(dirname(p), { recursive: true });
      writeFileSync(p, text);
    }
  const run = spawnSync('node', [GRADER, iter], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  let summary = null;
  try {
    summary = JSON.parse(readFileSync(join(iter, 'summary.json'), 'utf8'));
  } catch {
    /* a grader that exited early wrote none — the test asserts on status */
  }
  rmSync(iter, { recursive: true, force: true });
  return {
    status: run.status,
    stderr: run.stderr,
    summary,
    dir: `eval-${evalName}`,
  };
}

const checksFor = (res, cfg) =>
  res.summary?.results?.[res.dir]?.[cfg]?.expectations ?? [];
const check = (res, cfg, substring) =>
  checksFor(res, cfg).find((c) => c.text.includes(substring));
const score = (res, cfg) => {
  const cs = checksFor(res, cfg);
  return `${cs.filter((c) => c.passed).length}/${cs.length}`;
};

/* ------------------------------------------------------------------ *
 * 1. The failure that started this: a baseline that BUILDS the three
 *    interfaces the design system omits, using its own class names.
 *
 *    The old grader tested four literal spellings — govbb-tabs, govbb-modal,
 *    govbb-toggle, govbb-switch. This baseline types none of them, and scored
 *    full marks while building all three.
 * ------------------------------------------------------------------ */
console.log("\n1. Omitted interfaces, built under the run's own names");

const BASELINE_BUILT_THEM = {
  'src/tabs.tsx': `export function Tabs({ items }) {
  return (
    <div className="app-tabs" role="tablist">
      {items.map((t) => (
        <button role="tab" aria-selected={t.active} key={t.id}>{t.label}</button>
      ))}
    </div>
  );
}`,
  'src/confirm-dialog.tsx': `export function ConfirmDialog({ open, onConfirm }) {
  return (
    <div className="app-overlay" role="dialog" aria-modal="true">
      <button onClick={onConfirm}>Confirm</button>
    </div>
  );
}`,
  'src/switch.tsx': `export function Switch({ on, onChange }) {
  return <button role="switch" aria-checked={on} onClick={onChange} className="app-switch" />;
}`,
  'src/app.tsx': `import { Tabs } from './tabs';
import { ConfirmDialog } from './confirm-dialog';
import { Switch } from './switch';
import '@govtech-bb/frontend/css';
export default function App() {
  return <><Tabs items={[]} /><ConfirmDialog open /><Switch on /></>;
}`,
  'REPORT.md':
    'Scaffolded the renewal service with tabs, a confirm modal and a toggle switch.',
};

const SKILL_ROUTED_THEM = {
  'src/app.tsx': `import { Button, Checkbox } from '@govtech-bb/react';
import '@govtech-bb/frontend/css';
export default function App() {
  return (
    <main className="govbb-width-container">
      <Checkbox name="updates" label="Email me updates" />
      <Button type="submit">Continue</Button>
    </main>
  );
}`,
  'NOT-CONVERTED.md': `# Not converted

Three requested interfaces do not exist in the design system, deliberately.

| Requested | Why it is absent | Route |
|---|---|---|
| Tabs | One thing per page; tabs hide content behind a control | Separate pages |
| Modal | No modal component; confirmation gets its own page | Check-answers page |
| Toggle switch | No switch component; state must be explicit | Checkbox, used above |

Each is routed to the design team rather than substituted.`,
};

const traps = grade('build-new-react-with-traps', {
  with_skill: SKILL_ROUTED_THEM,
  without_skill: BASELINE_BUILT_THEM,
});

for (const iface of ['a tabs interface', 'a modal dialog', 'a toggle switch']) {
  const baseline = check(traps, 'without_skill', `Does not build ${iface}`);
  const skill = check(traps, 'with_skill', `Does not build ${iface}`);
  ok(
    `${iface}: caught in the baseline that built it`,
    baseline?.passed === false,
    baseline?.evidence,
  );
  ok(
    `${iface}: not falsely reported against the skill run`,
    skill?.passed === true,
  );
}

const gapsBaseline = check(traps, 'without_skill', 'recorded in writing');
const gapsSkill = check(traps, 'with_skill', 'recorded in writing');
ok('gap list: absent in the baseline', gapsBaseline?.passed === false);
ok('gap list: credited to the skill run', gapsSkill?.passed === true);

const withPct =
  traps.summary?.rows?.find((r) => r.cfg === 'with_skill')?.pct ?? 0;
const withoutPct =
  traps.summary?.rows?.find((r) => r.cfg === 'without_skill')?.pct ?? 0;
ok(
  'the two configurations no longer score identically',
  withPct > withoutPct,
  `with_skill ${score(traps, 'with_skill')} vs baseline ${score(traps, 'without_skill')} (${withPct - withoutPct} points)`,
);

/* ------------------------------------------------------------------ *
 * 2. False positives. A detector aggressive enough to catch the above
 *    must not condemn correct markup — govbb-header__toggle is a REAL
 *    class (the mobile nav button), and react-router's <Switch> is a
 *    route matcher, not a form control.
 * ------------------------------------------------------------------ */
console.log('\n2. Correct markup is not reported as an invented interface');

const CORRECT = {
  'index.html': `<header class="govbb-header" data-govbb-module="header">
  <button class="govbb-header__toggle" type="button">Menu</button>
</header>`,
  'src/routes.tsx': `import { Switch, Route } from 'react-router';
export const Routes = () => <Switch><Route path="/" /></Switch>;`,
  'NOT-CONVERTED.md':
    'Tabs, modal and toggle switch are absent from the system; each is routed to the design team.',
};

const clean = grade('build-new-react-with-traps', {
  with_skill: CORRECT,
  without_skill: CORRECT,
});
const toggle = check(clean, 'with_skill', 'Does not build a toggle switch');
ok(
  'govbb-header__toggle and react-router <Switch> are not a toggle switch',
  toggle?.passed === true,
  toggle?.evidence,
);

/* ------------------------------------------------------------------ *
 * 3. The reference stylesheet. Fetching the live CSS from the obvious
 *    URL returned homepage HTML; unnoticed, that grades every
 *    site-only class as invented.
 * ------------------------------------------------------------------ */
console.log('\n3. A reference stylesheet that is not a stylesheet is refused');

const tmp = mkdtempSync(join(tmpdir(), 'govbb-live-'));
const htmlPath = join(tmp, 'live.css');
writeFileSync(
  htmlPath,
  '<!doctype html>\n<html><body>homepage, not CSS</body></html>',
);
const refused = grade(
  'build-new-react-with-traps',
  { with_skill: CORRECT },
  { LIVE_CSS: htmlPath },
);
ok(
  'grader exits rather than grade against fetched HTML',
  refused.status === 2 && /not a stylesheet/.test(refused.stderr),
  refused.stderr.split('\n')[0],
);

const emptyPath = join(tmp, 'empty.css');
writeFileSync(emptyPath, '/* nothing here */\n');
const refusedEmpty = grade(
  'build-new-react-with-traps',
  { with_skill: CORRECT },
  { LIVE_CSS: emptyPath },
);
ok(
  'grader exits on a stylesheet defining no govbb rules',
  refusedEmpty.status === 2,
  refusedEmpty.stderr.split('\n')[0],
);
rmSync(tmp, { recursive: true, force: true });

/* ------------------------------------------------------------------ *
 * 4. The review fixture must not contain its own answer key.
 * ------------------------------------------------------------------ */
console.log('\n4. The review fixture does not carry its answer key');

const fixture = readFileSync(join(HERE, 'fixtures/review-me.html'), 'utf8');
const header = fixture.slice(0, fixture.indexOf('-->'));
const leaks = [
  ['a numbered list of planted issues', /^\s*\d+\.\s+\S/m],
  ['the real answer for the invented token', /--govbb-color-brand/],
  ['the real answer for the invented alert class', /status[- ]banner/i],
];
for (const [what, pattern] of leaks)
  ok(`header comment does not contain ${what}`, !pattern.test(header));

console.log(
  failures
    ? `\n${failures} failing assertion(s)\n`
    : '\nAll grader tests passed\n',
);
process.exit(failures ? 1 : 0);
