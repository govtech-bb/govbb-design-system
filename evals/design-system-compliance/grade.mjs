/*
 * Mechanical grading for the design-system-compliance evals.
 *
 * Only checks assertions that can be decided by inspecting files — class and
 * token resolution, file immutability, presence or absence of specific names.
 * Judgement-based assertions (did it explain WHY tabs are absent, is the gap
 * list actionable) are left for human review in the viewer.
 *
 *   node grade.mjs <iteration-dir> [--pension-dir <path>]
 *
 * Needs packages/frontend/dist/govbb.css built, or it exits rather than grade
 * every real class as invented. The conversion prototype is outside this repo,
 * so pass its path with --pension-dir (or PENSION_DIR); without it the
 * immutability assertion reports that it could not be checked. See evals/README.md.
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ITER = process.argv[2];
if (!ITER) {
  console.error('usage: node grade.mjs <iteration-dir>');
  process.exit(2);
}
if (!existsSync(ITER)) {
  console.error(`iteration dir not found: ${ITER}`);
  process.exit(2);
}
/* Derived from this file's own location rather than hardcoded, so the script is
   runnable from any checkout instead of only the machine it was written on. */
const REPO = fileURLToPath(new URL('../../', import.meta.url));

/*
 * Grade against the union of the local build and the deployed stylesheet.
 *
 * The local checkout is behind origin/main, so classes that exist on the
 * deployed site (govbb-footer__list, govbb-header__home) are absent locally.
 * Checking only the local build marks those real classes as invented and
 * penalises exactly the behaviour the skill asks for — reading the live site.
 */
const LIVE_CSS = process.env.LIVE_CSS ?? '/tmp/live.css';
if (!existsSync(LIVE_CSS))
  console.warn(
    `warning: ${LIVE_CSS} absent — grading against the local build only.\n` +
      '  Classes that exist only on the deployed site will be scored as invented,\n' +
      '  so name-resolution results are not comparable with runs that had it.',
  );
/*
 * Every name-resolution assertion is decided against this stylesheet, so a
 * missing or stale build does not degrade the grading — it inverts it, marking
 * real classes as invented. `dist/` is gitignored, so a fresh checkout has none.
 * Refuse to grade rather than report a run as full of invented names.
 */
const DIST = join(REPO, 'packages/frontend/dist/govbb.css');
if (!existsSync(DIST)) {
  console.error(
    `stylesheet not built: ${DIST}\n` +
      'Build it first, or every govbb- class will be graded as invented:\n' +
      '  pnpm --filter @govtech-bb/frontend build',
  );
  process.exit(2);
}
/*
 * Verify the live stylesheet is a stylesheet. Fetching it from the obvious URL
 * returns the homepage HTML, which parses to zero classes — so an unnoticed bad
 * fetch does not weaken name resolution, it silently narrows the reference set
 * and grades every site-only class as invented. Refuse rather than warn: a
 * warning in a scrollback is how this went unnoticed the first time.
 */
if (existsSync(LIVE_CSS)) {
  const live = readFileSync(LIVE_CSS, 'utf8');
  const looksLikeHtml = /^﻿?\s*</.test(live);
  const hasRules = /\.govbb-[a-zA-Z0-9_-]+[^{}]*\{/.test(live);
  if (looksLikeHtml || !hasRules) {
    console.error(
      `${LIVE_CSS} is not a stylesheet: ${looksLikeHtml ? 'it starts with markup — the fetch returned a page, not the CSS' : 'it defines no .govbb- rules'}.\n` +
        'Grading with it would mark real classes as invented. Re-fetch it from the\n' +
        `stylesheet URL in the deployed page's <link rel="stylesheet">, or delete ${LIVE_CSS}\n` +
        'to grade against the local build alone.',
    );
    process.exit(2);
  }
}

const CSS = [
  readFileSync(DIST, 'utf8'),
  existsSync(LIVE_CSS) ? readFileSync(LIVE_CSS, 'utf8') : '',
].join('\n');

/** Every govbb- class actually defined in the shipped stylesheet. */
const realClasses = new Set(
  [...CSS.matchAll(/\.(govbb-[a-zA-Z0-9_-]+)/g)].map((m) => m[1]),
);
/** Every --govbb- custom property actually defined. */
const realTokens = new Set(
  [...CSS.matchAll(/(--govbb-[a-zA-Z0-9-]+)\s*:/g)].map((m) => m[1]),
);

/*
 * A floor under the reference set. The build currently defines ~160 classes and
 * ~85 tokens; a truncated, empty or wrong-package stylesheet passes every
 * existence check above while resolving almost nothing, and the failure shows up
 * as a run that "invented" all its names. Well under the real numbers, so it
 * catches a broken reference without tracking the system's growth.
 */
for (const [what, set, floor] of [
  ['classes', realClasses, 40],
  ['tokens', realTokens, 20],
]) {
  if (set.size < floor) {
    console.error(
      `only ${set.size} ${what} found in the reference stylesheet — expected at least ${floor}.\n` +
        `The build at ${DIST} is empty, truncated or not the design system.\n` +
        'Rebuild it: pnpm --filter @govtech-bb/frontend build',
    );
    process.exit(2);
  }
}

/*
 * Vendored and installed copies of the design system are not the run's own
 * output. Grading them attributes the system's own CSS and runtime to the
 * agent — it is how `.govbb-table {` and a real `initAll()` were previously
 * counted as the run's work.
 */
const VENDORED = /(^|\/)(node_modules|vendor|dist)(\/|$)|@govtech-bb/;

/*
 * Prune vendored trees while descending rather than filtering after, and never
 * follow a symlink. Both matter because a run that installed dependencies has a
 * node_modules, and pnpm's is built out of symlinks: walking it costs thousands
 * of stats for files that are then discarded, and it crashes outright on the two
 * link shapes that layout produces — a loop raises ENAMETOOLONG and a dangling
 * link raises ENOENT, either of which ends grading part-way through with no
 * result.
 *
 * Dirent types come from the directory entry itself, so a symlink reports as a
 * link rather than as whatever it points at. Skipping links is also the right
 * grading call: a linked file is not something the run wrote, and its target may
 * sit outside the output directory entirely.
 */
function walk(dir, root = dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = join(dir, entry.name);
    if (VENDORED.test(p.slice(root.length))) return [];
    if (entry.isSymbolicLink()) return [];
    return entry.isDirectory() ? walk(p, root) : [p];
  });
}

/*
 * Include every module extension, not just .js/.ts. An agent that scaffolds
 * with `main.mjs` was previously graded as producing no code at all — every
 * content check saw an empty string and the run scored as if it had written
 * nothing, which reads as a failure of the agent rather than of the grader.
 */
const CODE = /\.(html|[mc]?jsx?|[mc]?tsx?|css|md|json)$/;

const read = (dir) =>
  walk(dir)
    .filter((f) => CODE.test(f))
    .map((f) => ({ file: f, text: readFileSync(f, 'utf8') }));

/** Classes used in class= / className= attributes, which is what actually ships. */
function usedClasses(files) {
  const out = new Map();
  for (const { file, text } of files) {
    for (const m of text.matchAll(/class(?:Name)?=["'{`]([^"'}`]+)["'}`]/g))
      for (const c of m[1].split(/\s+/))
        if (c.startsWith('govbb-')) out.set(c, file);
  }
  return out;
}

function usedTokens(files) {
  const out = new Map();
  for (const { file, text } of files)
    for (const m of text.matchAll(/var\((--govbb-[a-zA-Z0-9-]+)/g))
      out.set(m[1], file);
  return out;
}

const hash = (f) =>
  existsSync(f)
    ? createHash('sha256').update(readFileSync(f)).digest('hex')
    : null;

/* Baselines recorded before the runs. Missing ones are reported as such rather
   than crashing with an opaque ENOENT halfway through grading. */
const baseline = (name) => {
  const p = join(ITER, name);
  return existsSync(p) ? readFileSync(p, 'utf8').trim() : null;
};
const fixtureBaseline = baseline('fixture-hash-before.txt');
const fixtureBefore = fixtureBaseline ? fixtureBaseline.split(/\s+/)[0] : null;

/*
 * Parse `hash  path` lines into a path→hash map. An earlier version compared a
 * SET of hashes with paths discarded, which cannot tell a rename from an
 * untouched file and cannot see an added file at all — both of which are
 * modifications of the directory the assertion claims is unmodified. Lines
 * carrying only a hash still work; the comparison degrades to a set and says so.
 */
const parseHashes = (text) => {
  const map = new Map();
  let pathsPresent = true;
  for (const line of text.split('\n').filter((l) => l.trim())) {
    const [h, ...rest] = line.trim().split(/\s+/);
    const path = rest.join(' ').replace(/^\*/, '');
    if (!path) pathsPresent = false;
    map.set(path || h, h);
  }
  return { map, pathsPresent };
};

/*
 * The prototype under conversion lives outside this repository, so its location
 * cannot be derived. Take it from --pension-dir or PENSION_DIR, falling back to
 * a sibling of the repo, and treat "not found" as unverifiable rather than
 * passing. The previous version hashed a hardcoded absolute path through
 * `.filter(Boolean)`, so on any other machine both sides were empty sets and the
 * immutability assertion passed without comparing anything.
 */
const pensionFlag = process.argv.indexOf('--pension-dir');
const PENSION =
  pensionFlag !== -1 && process.argv[pensionFlag + 1]
    ? process.argv[pensionFlag + 1]
    : (process.env.PENSION_DIR ?? join(REPO, '../pension-calculator'));

const pensionBaseline = baseline('pension-hash-before.txt');
const pensionBefore = pensionBaseline ? parseHashes(pensionBaseline) : null;

const relHashes = (dir) => {
  const map = new Map();
  for (const f of walk(dir)) {
    if (VENDORED.test(f.slice(dir.length))) continue;
    map.set(f.slice(dir.length).replace(/^\//, ''), hash(f));
  }
  return map;
};
const pensionNow = existsSync(PENSION) ? relHashes(PENSION) : null;

/** Compare path→hash maps, reporting what actually differs. */
const compareHashes = (before, now) => {
  if (!before) return { ok: false, why: 'no pension-hash-before.txt baseline' };
  if (!now) return { ok: false, why: `prototype not found at ${PENSION}` };
  if (!before.pathsPresent) {
    const b = new Set(before.map.values());
    const n = new Set(now.values());
    const ok = b.size === n.size && [...b].every((x) => n.has(x));
    return {
      ok,
      why: ok
        ? `${n.size} hashes match (baseline has no paths, so a rename would pass)`
        : 'hash set differs',
    };
  }
  const changed = [];
  for (const [p, h] of before.map)
    if (!now.has(p)) changed.push(`removed ${p}`);
    else if (now.get(p) !== h) changed.push(`modified ${p}`);
  for (const p of now.keys())
    if (!before.map.has(p)) changed.push(`added ${p}`);
  return {
    ok: changed.length === 0,
    why: changed.length
      ? changed.slice(0, 6).join('; ')
      : `${now.size} files unchanged`,
  };
};

const FIXTURE = join(
  REPO,
  'evals/design-system-compliance/fixtures/review-me.html',
);

/* The ten violations planted in the fixture, and what a correct review names. */
const PLANTED = [
  ['govbb-card invented', /govbb-card/i],
  [
    'govbb-alert invented + Status banner named',
    /govbb-alert/i,
    /status[- ]banner/i,
  ],
  ['govbb-badge invented', /govbb-badge/i],
  [
    '--govbb-color-primary invented + brand named',
    /--govbb-color-primary/,
    /--govbb-color-brand/,
  ],
  [
    '.govbb-button override = restyling internals',
    /govbb-button/,
    /overrid|restyl|internal/i,
  ],
  ['header missing data-govbb-module', /header/i, /data-govbb-module|initAll/],
  [
    'file upload missing module wiring',
    /file[- ]upload/i,
    /data-govbb-module|initAll/,
  ],
  ['hardcoded #00267f / 16px / 1.25rem', /#00267f|16px|1\.25rem/],
  [
    '--govbb-blue-100 used as primitive',
    /--govbb-blue-100/,
    /primitive|semantic/i,
  ],
  ['hint not associated', /hint/i, /aria-describedby|associat/i],
];

/*
 * The three interfaces eval 1 asks for and the system does not have.
 *
 * `signals` are things the interface cannot be built without — its ARIA
 * contract, its component identifier, an invented `govbb-` class. `file` catches
 * the component given its own module. `notWhen` suppresses a known collision:
 * react-router's `<Switch>` is a route matcher, not a form control.
 *
 * Patterns are deliberately narrow at the word boundary. `govbb-header__toggle`
 * is a REAL class (the mobile nav button), so a loose /toggle/ would report the
 * correct markup as an invented switch.
 */
const OMITTED_INTERFACES = [
  {
    name: 'a tabs interface',
    signals: [
      /govbb-tabs?\b/,
      /role=["']tab(list|panel)?["']/,
      /aria-selected\s*=/,
      /<Tabs?\b|<TabList\b|<TabPanel\b/,
    ],
    file: /(^|\/)tabs?\.[mc]?[jt]sx?$/i,
    inProse: /\btabs?\b/i,
  },
  {
    name: 'a modal dialog',
    signals: [
      /govbb-(modal|dialog)\b/,
      /role=["'](alert)?dialog["']/,
      /aria-modal\s*=/,
      /<dialog[\s/>]/i,
      /\.showModal\s*\(/,
      /<[A-Z][A-Za-z]*(Modal|Dialog)\b|<(Modal|Dialog)\b/,
    ],
    file: /(^|\/)[a-z-]*(modal|dialog)\.[mc]?[jt]sx?$/i,
    inProse: /\bmodals?\b|\bdialog\b/i,
  },
  {
    name: 'a toggle switch',
    signals: [
      /govbb-(toggle|switch)\b/,
      /role=["']switch["']/,
      /<(Toggle|Switch)\b/,
    ],
    file: /(^|\/)(toggle|switch)\.[mc]?[jt]sx?$/i,
    inProse: /\bswitch\b|\btoggle\b/i,
    notWhen: /from\s+['"]react-router/,
  },
];

const results = {};

for (const evalDir of readdirSync(ITER).filter((d) => d.startsWith('eval-'))) {
  results[evalDir] = {};
  for (const cfg of ['with_skill', 'without_skill']) {
    const out = join(ITER, evalDir, cfg, 'outputs');
    const files = read(out);
    const all = files.map((f) => f.text).join('\n');
    /* A report describing what it removed will quote the very names it deleted.
       Content checks look only at shipped artefacts; prose is graded by eye. */
    const artefacts = files.filter((f) => !/\.md$/i.test(f.file));
    const shipped = artefacts.map((f) => f.text).join('\n');
    /* Strip comments before looking for calls. A file that documents "do NOT
       call initAll()" was previously graded as calling it. */
    const strip = (t) =>
      t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/[^\n]*/g, '$1');
    const shippedCode = strip(shipped);
    const checks = [];

    const add = (text, passed, evidence) =>
      checks.push({ text, passed, evidence });

    if (files.length === 0) {
      add('Produced any output at all', false, `no readable files in ${out}`);
      results[evalDir][cfg] = { expectations: checks };
      continue;
    }
    add('Produced any output at all', true, `${files.length} files`);

    /*
     * Name resolution only means something for the generative cases. In the
     * review case, naming an invented class or token is the whole job — a
     * review that quotes `--govbb-color-primary` to condemn it would otherwise
     * be marked down for "using" it, which is backwards.
     */
    if (!evalDir.includes('review')) {
      const uc = usedClasses(artefacts);
      const badC = [...uc].filter(([c]) => !realClasses.has(c));
      add(
        'Every govbb- class used resolves in dist/govbb.css',
        badC.length === 0,
        badC.length
          ? `invented: ${badC.map(([c]) => c).join(', ')}`
          : `${uc.size} classes, all real`,
      );

      const ut = usedTokens(artefacts);
      const badT = [...ut].filter(([t]) => !realTokens.has(t));
      add(
        'Every --govbb- token used is defined in dist/govbb.css',
        badT.length === 0,
        badT.length
          ? `invented: ${badT.map(([t]) => t).join(', ')}`
          : `${ut.size} tokens, all real`,
      );
    }

    // --- eval 0: conversion ---
    if (evalDir.includes('convert')) {
      const legacy = [
        '--spacing-xs',
        '--color-grey-00',
        '--font-size-body',
      ].filter((t) => shipped.includes(t));
      add(
        "Prototype's own token system does not survive in the output",
        legacy.length === 0,
        legacy.length
          ? `still present: ${legacy.join(', ')}`
          : 'none carried over',
      );
      add(
        'Local .govbb-table redefinition not carried into converted CSS',
        // Anchor to a selector start: `.app-prose > .govbb-table {` is the
        // correct pattern the skill teaches, not a redefinition.
        !/(^|[,}])\s*\.govbb-table\s*\{/m.test(shipped),
        /(^|[,}])\s*\.govbb-table\s*\{/m.test(shipped)
          ? 'redefines .govbb-table at selector root'
          : 'not redefined',
      );
      const pension = compareHashes(pensionBefore, pensionNow);
      add(
        'Original pension-calculator files left unmodified',
        pension.ok,
        pension.why,
      );
      /*
       * Discriminating checks. The name-resolution assertions above pass for a
       * capable agent with or without the skill, so they measure nothing. These
       * three separate the two configurations, and each is a functional defect
       * rather than a style preference.
       */
      const modules = shipped.match(/data-govbb-module="[a-z-]+"/g) ?? [];
      add(
        'Behavioural components carry data-govbb-module',
        modules.length > 0,
        modules.length
          ? [...new Set(modules)].join(' ')
          : 'none — components will not work',
      );
      add(
        'initAll() is wired so those components initialise',
        /initAll/.test(shipped),
        /initAll/.test(shipped)
          ? 'wired'
          : 'absent — steppers and mobile nav are dead',
      );
      const rep = files
        .filter((f) => /\.md$/i.test(f.file))
        .map((f) => f.text)
        .join('\n');
      add(
        'Binding design-log decisions were consulted',
        /design.?log|short-pages|no-faqs/i.test(rep),
        /design.?log|short-pages|no-faqs/i.test(rep)
          ? 'cited'
          : 'not mentioned',
      );

      add(
        'A report was produced',
        files.some((f) => /REPORT\.md$/i.test(f.file)),
        files.map((f) => f.file.split('/').pop()).join(', '),
      );
    }

    // --- eval 1: React traps ---
    if (evalDir.includes('react')) {
      /*
       * Tabs, a modal and a toggle switch are the three interfaces this eval
       * asks for and the design system deliberately does not provide. The
       * question is whether a run BUILT one — under any name — not whether it
       * typed `govbb-tabs`.
       *
       * The previous version tested those four literal spellings. A baseline
       * run that built working Tabs, Switch and ConfirmDialog components with
       * its own class names passed all four checks while doing the precise
       * thing this eval exists to catch, and the eval reported no difference
       * between baseline and skill. A check that passes while examining the
       * wrong thing is worse than no check.
       *
       * So detect each interface by what it cannot be built without: its ARIA
       * contract, its component identifier, or its own file.
       */
      for (const iface of OMITTED_INTERFACES) {
        const hits = [];
        for (const { file, text } of artefacts) {
          if (iface.notWhen?.test(text)) continue;
          const rel = file.slice(out.length).replace(/^\//, '');
          const src = strip(text);
          if (iface.file.test(rel)) hits.push(`${rel} (whole file)`);
          for (const p of iface.signals) {
            const m = src.match(p);
            if (m) hits.push(`${rel}: ${m[0].trim()}`);
          }
        }
        const built = [...new Set(hits)];
        add(
          `Does not build ${iface.name} under any name`,
          built.length === 0,
          built.length
            ? `BUILT — ${built.slice(0, 4).join('; ')}`
            : 'not built, under this or any other name',
        );
      }
      /*
       * The counterpart to the check above: recording the three as gaps is the
       * behaviour the skill is supposed to produce, and it is what actually
       * separated the two configurations when the outputs were read by hand.
       * Graded on prose, so it is a keyword match — it can tell a routed gap
       * from silence, not a good gap list from a lazy one.
       */
      const prose = files
        .filter((f) => /\.md$/i.test(f.file))
        .map((f) => f.text)
        .join('\n');
      const namedInProse = OMITTED_INTERFACES.filter((i) =>
        i.inProse.test(prose),
      );
      add(
        'All three unavailable interfaces are recorded in writing, not silently substituted',
        namedInProse.length === OMITTED_INTERFACES.length &&
          /gap|not[- ]converted|not available|does not exist|deliberately|route/i.test(
            prose,
          ),
        prose
          ? `named ${namedInProse.length}/${OMITTED_INTERFACES.length} in ${files.filter((f) => /\.md$/i.test(f.file)).length} markdown file(s)`
          : 'no markdown written at all',
      );
      add(
        'initAll() not called in React code',
        !/initAll\s*\(/.test(shippedCode),
        /initAll\s*\(/.test(shippedCode) ? 'initAll() called' : 'not called',
      );
      add(
        'Imports components from @govtech-bb/react',
        /@govtech-bb\/react/.test(all),
        /@govtech-bb\/react/.test(all) ? 'yes' : 'no',
      );
      // Count import statements in source files, not every textual mention:
      // package.json and build config name the package too.
      const cssImports = artefacts
        .filter((f) => /\.(m?[jt]sx?|html)$/.test(f.file))
        .flatMap((f) => [
          ...strip(f.text).matchAll(
            /(?:import\s+['"]|href=['"])[^'"]*@govtech-bb\/frontend\/css/g,
          ),
        ]).length;
      add(
        'Stylesheet imported exactly once',
        cssImports === 1,
        `${cssImports} import(s)`,
      );
      add(
        'States that tabs and modal are not in the system',
        /(tabs?|modal)[^.]{0,120}(do(es)? not exist|not (in|part of|available)|no .{0,20}component)/i.test(
          all,
        ) || /(no|not).{0,40}(tabs?|modal).{0,40}component/i.test(all),
        'keyword match on the explanation',
      );
      add(
        'Uses Checkbox for the updates opt-in rather than a switch',
        /Checkbox/.test(all),
        /Checkbox/.test(all) ? 'Checkbox present' : 'no Checkbox',
      );
    }

    // --- eval 2: review ---
    if (evalDir.includes('review')) {
      for (const [label, ...pats] of PLANTED) {
        const ok = pats.every((p) => p.test(all));
        add(`Reports: ${label}`, ok, ok ? 'found' : 'not reported');
      }
      add(
        'Fixture left byte-for-byte unmodified',
        fixtureBefore !== null && hash(FIXTURE) === fixtureBefore,
        fixtureBefore === null
          ? 'no fixture-hash-before.txt baseline — cannot verify'
          : hash(FIXTURE) === fixtureBefore
            ? 'hash matches'
            : 'FIXTURE MODIFIED',
      );
      add(
        'Did not produce a rewritten version of the file',
        !files.some((f) => /review-me|\.html$/.test(f.file)),
        files.map((f) => f.file.split('/').pop()).join(', '),
      );
    }

    results[evalDir][cfg] = { expectations: checks };
  }
}

/* Write per-run grading.json and print a summary table. */
let rows = [];
for (const [evalDir, cfgs] of Object.entries(results)) {
  for (const [cfg, data] of Object.entries(cfgs)) {
    writeFileSync(
      join(ITER, evalDir, cfg, 'grading.json'),
      JSON.stringify(data, null, 2),
    );
    const p = data.expectations.filter((e) => e.passed).length;
    const n = data.expectations.length;
    rows.push({
      evalDir,
      cfg,
      passed: p,
      total: n,
      pct: Math.round((p / n) * 100),
    });
  }
}

console.log('\n=== mechanical assertion results ===\n');
for (const e of new Set(rows.map((r) => r.evalDir))) {
  console.log(e);
  for (const cfg of ['with_skill', 'without_skill']) {
    const r = rows.find((x) => x.evalDir === e && x.cfg === cfg);
    if (r)
      console.log(
        `  ${cfg.padEnd(14)} ${String(r.passed).padStart(2)}/${r.total}  ${r.pct}%`,
      );
  }
  const w = rows.find((x) => x.evalDir === e && x.cfg === 'with_skill');
  const b = rows.find((x) => x.evalDir === e && x.cfg === 'without_skill');
  if (w && b)
    console.log(
      `  delta          ${w.pct - b.pct > 0 ? '+' : ''}${w.pct - b.pct} points`,
    );
  console.log();
}

console.log('=== failures worth reading ===\n');
for (const [evalDir, cfgs] of Object.entries(results))
  for (const [cfg, data] of Object.entries(cfgs))
    for (const e of data.expectations.filter((x) => !x.passed))
      console.log(
        `  [${cfg}] ${evalDir}\n      ${e.text}\n      → ${e.evidence}`,
      );

writeFileSync(
  join(ITER, 'summary.json'),
  JSON.stringify({ rows, results }, null, 2),
);
console.log(`\nWrote ${join(ITER, 'summary.json')}`);
