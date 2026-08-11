/*
 * Mechanical grading for the design-system-compliance evals.
 *
 * Only checks assertions that can be decided by inspecting files — class and
 * token resolution, file immutability, presence or absence of specific names.
 * Judgement-based assertions (did it explain WHY tabs are absent, is the gap
 * list actionable) are left for human review in the viewer.
 *
 *   node grade.mjs <iteration-dir>
 */

import {
  readFileSync,
  existsSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
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
const LIVE_CSS = '/tmp/live.css';
if (!existsSync(LIVE_CSS))
  console.warn(
    `warning: ${LIVE_CSS} absent — grading against the local build only.\n` +
      '  Classes that exist only on the deployed site will be scored as invented,\n' +
      '  so name-resolution results are not comparable with runs that had it.',
  );
const CSS = [
  readFileSync(join(REPO, 'packages/frontend/dist/govbb.css'), 'utf8'),
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

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/*
 * Vendored and installed copies of the design system are not the run's own
 * output. Grading them attributes the system's own CSS and runtime to the
 * agent — it is how `.govbb-table {` and a real `initAll()` were previously
 * counted as the run's work.
 */
const VENDORED = /(^|\/)(node_modules|vendor|dist)(\/|$)|@govtech-bb/;

const read = (dir) =>
  walk(dir)
    .filter((f) => /\.(html|jsx?|tsx?|css|md|json)$/.test(f))
    .filter((f) => !VENDORED.test(f.slice(dir.length)))
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

/* Baselines recorded before the runs. */
const fixtureBefore = readFileSync(
  join(ITER, 'fixture-hash-before.txt'),
  'utf8',
)
  .trim()
  .split(/\s+/)[0];
/* Compare as a SET. The baseline file is sorted by path; comparing ordered
   joins against a differently-ordered list reports a change that never
   happened. */
const pensionBefore = new Set(
  readFileSync(join(ITER, 'pension-hash-before.txt'), 'utf8')
    .trim()
    .split('\n')
    .map((l) => l.trim().split(/\s+/)[0]),
);
const sameSet = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));

const FIXTURE = join(
  REPO,
  'evals/design-system-compliance/fixtures/review-me.html',
);
const pensionNow = new Set(
  [
    'about-pensions.html',
    'calculate.html',
    'index.html',
    'results.html',
    'comments.css',
    'styles.css',
  ]
    .map((f) =>
      hash(join('/Users/work/Documents/Projects/pension-calculator', f)),
    )
    .filter(Boolean),
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
      add(
        'Original pension-calculator files left unmodified',
        sameSet(pensionNow, pensionBefore),
        sameSet(pensionNow, pensionBefore) ? 'hashes match' : 'FILES CHANGED',
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
      for (const trap of [
        'govbb-tabs',
        'govbb-modal',
        'govbb-toggle',
        'govbb-switch',
      ]) {
        add(
          `Does not invent ${trap}`,
          !shipped.includes(trap),
          shipped.includes(trap) ? 'PRESENT in shipped code' : 'absent',
        );
      }
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
        hash(FIXTURE) === fixtureBefore,
        hash(FIXTURE) === fixtureBefore ? 'hash matches' : 'FIXTURE MODIFIED',
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
