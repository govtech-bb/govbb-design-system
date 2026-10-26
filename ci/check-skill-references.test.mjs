#!/usr/bin/env node
/**
 * Tests for check-skill-references.mjs, against the repo's real build.
 *
 * Each case is asserted in both directions (ADR 0004): the real name passes
 * and a misspelt one fails. A checker only ever run against the clean skills
 * cannot tell you it rejects anything.
 *
 *   pnpm build && node ci/check-skill-references.test.mjs
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = mkdtempSync(join(tmpdir(), 'govbb-skill-references-test-'));
let failures = 0;

const check = (markdown) => {
  writeFileSync(join(root, 'SKILL.md'), `${markdown}\n`);
  return spawnSync(process.execPath, ['ci/check-skill-references.mjs', root], {
    encoding: 'utf8',
  });
};

const expect = (name, markdown, shouldPass) => {
  const { status, stdout, stderr } = check(markdown);
  // A crash also exits 1, so a failure only counts if the misspelt name was
  // the one thing reported.
  const passed = shouldPass
    ? status === 0
    : status === 1 && stderr.includes('Skills name 1 thing(s)');
  console.log(`  ${passed ? 'PASS' : 'FAIL'}  ${name}`);
  if (!passed) {
    console.log(`        exit ${status}\n${stdout}${stderr}`);
    failures++;
  }
};

const cases = [
  ['class', '`govbb-error-summary__link`', '`govbb-error-summary__linkX`'],
  ['class with uppercase', '`govbb-header`', '`govbb-Header`'],
  ['class with underscore', '`govbb-error-summary`', '`govbb-error_summary`'],
  [
    'second class in a chained selector',
    '`.govbb-link.govbb-error-summary__link`',
    '`.govbb-link.govbb-error-summary__linx`',
  ],
  ['token', '`--govbb-color-ink`', '`--govbb-color-inkX`'],
  ['token family', '`--govbb-space-*`', '`--govbb-spcae-*`'],
  ['class family', '`govbb-text-*`', '`govbb-txet-*`'],
  ['attribute', '`data-govbb-module`', '`data-govbb-moduleX`'],
  ['package export', '`@govtech-bb/frontend/css`', '`@govtech-bb/frontend/cs`'],
  [
    'wildcard package export',
    '`@govtech-bb/frontend/assets/fonts/figtree-latin.woff2`',
    '`@govtech-bb/frontend/assets/fonts/figtree-latn.woff2`',
  ],
  [
    'wildcard package export of a directory',
    '`@govtech-bb/frontend/assets/fonts/figtree-latin.woff2`',
    '`@govtech-bb/frontend/assets/fonts`',
  ],
  [
    'shipped image beside a class',
    '<img class="govbb-header__logo" src="/assets/images/govbb-logo.svg" alt="Government of Barbados" />',
    '<img class="govbb-header__logoX" src="/assets/images/govbb-logo.svg" alt="Government of Barbados" />',
  ],
  ['docs page', '`/styles/colour.md`', '`/styles/colur.md`'],
  [
    'docs-site URL',
    'https://design-system.service.alpha.gov.bb/styles/colour.md',
    'https://design-system.service.alpha.gov.bb/styles/colur.md',
  ],
  ['page without an extension', '`/sitemap/`', '`/sitemapx/`'],
];

try {
  for (const [name, valid, invalid] of cases) {
    expect(`${name}: real name passes`, valid, true);
    expect(`${name}: misspelt name fails`, invalid, false);
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}

if (failures) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${cases.length * 2} checks passed.`);
