import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('./sync-npm-latest.mjs', import.meta.url));
const frontend = '@govtech-bb/frontend';
const react = '@govtech-bb/react';
const alpha = '1.0.0-alpha.29';
const registry = '--registry=https://registry.npmjs.org';

function packageMetadata() {
  return Object.fromEntries(
    [frontend, react].map((name, index) => {
      const latest = `1.0.0-alpha.${17 - index}`;
      return [
        name,
        { versions: [latest, alpha], 'dist-tags': { latest, alpha } },
      ];
    }),
  );
}

function createNpmFixture(t, metadata = packageMetadata()) {
  const directory = mkdtempSync(join(tmpdir(), 'govbb-npm-tags-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  writeFileSync(join(directory, 'registry.json'), JSON.stringify(metadata));
  writeFileSync(
    join(directory, 'npm'),
    `#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const calls = JSON.parse(readFileSync('calls.json', 'utf8'));
calls.push(args);
writeFileSync('calls.json', JSON.stringify(calls));
const metadata = JSON.parse(readFileSync('registry.json', 'utf8'));

if (args[0] === 'view') {
  const name = args[1];
  assert.ok(Object.hasOwn(metadata, name), 'Unexpected package');
  assert.deepEqual(args, ['view', name, 'versions', 'dist-tags', '--json', '${registry}']);
  if (process.env.NPM_TEST_FAIL_VIEW === name) {
    console.error('simulated npm view failure');
    process.exit(1);
  }
  console.log(process.env.NPM_TEST_INVALID_JSON === name ? '{' : JSON.stringify(metadata[name]));
} else if (args[0] === 'dist-tag') {
  const separator = args[2].lastIndexOf('@');
  const name = args[2].slice(0, separator);
  const version = args[2].slice(separator + 1);
  assert.deepEqual(args, ['dist-tag', 'add', name + '@' + version, 'latest', '${registry}']);
  assert.ok(metadata[name].versions.includes(version), 'Unpublished version');
  if (process.env.NPM_TEST_FAIL_TAG === name) {
    console.error('simulated npm dist-tag failure');
    process.exit(1);
  }
  metadata[name]['dist-tags'].latest = version;
  writeFileSync('registry.json', JSON.stringify(metadata));
} else {
  throw new Error('Unexpected npm command: ' + args.join(' '));
}
`,
    { mode: 0o755 },
  );

  return (env = {}) => {
    writeFileSync(join(directory, 'calls.json'), '[]');
    const result = spawnSync(process.execPath, [script], {
      cwd: directory,
      env: {
        ...process.env,
        PATH: `${directory}${delimiter}${process.env.PATH}`,
        ...env,
      },
      encoding: 'utf8',
      timeout: 10_000,
    });
    assert.ifError(result.error);
    const calls = JSON.parse(
      readFileSync(join(directory, 'calls.json'), 'utf8'),
    );
    return {
      ...result,
      calls,
      tagCalls: calls.filter((args) => args[0] === 'dist-tag'),
      metadata: JSON.parse(
        readFileSync(join(directory, 'registry.json'), 'utf8'),
      ),
    };
  };
}

test('reads both packages before correcting the legacy latest tags', (t) => {
  const result = createNpmFixture(t)();
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.calls, [
    ['view', frontend, 'versions', 'dist-tags', '--json', registry],
    ['view', react, 'versions', 'dist-tags', '--json', registry],
    ['dist-tag', 'add', `${frontend}@${alpha}`, 'latest', registry],
    ['dist-tag', 'add', `${react}@${alpha}`, 'latest', registry],
  ]);
  assert.equal(result.metadata[frontend]['dist-tags'].latest, alpha);
  assert.equal(result.metadata[react]['dist-tags'].latest, alpha);
});

test('a repeated run makes no tag writes', (t) => {
  const run = createNpmFixture(t);
  const first = run();
  assert.equal(first.status, 0, first.stderr);
  const second = run();
  assert.equal(second.status, 0, second.stderr);
  assert.deepEqual(second.tagCalls, []);
});

test('only corrects the remaining package in a partially updated pair', (t) => {
  const metadata = packageMetadata();
  metadata[frontend]['dist-tags'].latest = alpha;
  const result = createNpmFixture(t, metadata)();
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.tagCalls, [
    ['dist-tag', 'add', `${react}@${alpha}`, 'latest', registry],
  ]);
});

test('repairs missing latest tags only when there is no stable history', (t) => {
  const metadata = packageMetadata();
  for (const pkg of Object.values(metadata)) delete pkg['dist-tags'].latest;
  const result = createNpmFixture(t, metadata)();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.tagCalls.length, 2);
  assert.equal(result.metadata[frontend]['dist-tags'].latest, alpha);
  assert.equal(result.metadata[react]['dist-tags'].latest, alpha);
});

test('uses the current alpha rather than an old release workflow input', (t) => {
  const metadata = packageMetadata();
  for (const pkg of Object.values(metadata)) {
    pkg.versions.push('1.0.0-alpha.30');
    pkg['dist-tags'].alpha = '1.0.0-alpha.30';
  }
  const result = createNpmFixture(
    t,
    metadata,
  )({
    RELEASE_VERSION: '1.0.0-alpha.21',
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.tagCalls, [
    ['dist-tag', 'add', `${frontend}@1.0.0-alpha.30`, 'latest', registry],
    ['dist-tag', 'add', `${react}@1.0.0-alpha.30`, 'latest', registry],
  ]);
});

for (const nextAlpha of [alpha, '1.1.0-alpha.1']) {
  test(`preserves stable latest when alpha is ${nextAlpha}`, (t) => {
    const metadata = packageMetadata();
    for (const pkg of Object.values(metadata)) {
      pkg.versions.push('1.0.0', nextAlpha);
      pkg['dist-tags'] = { latest: '1.0.0', alpha: nextAlpha };
    }
    const result = createNpmFixture(t, metadata)();
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(result.tagCalls, []);
    assert.deepEqual(result.metadata, metadata);
  });
}

for (const name of [frontend, react]) {
  for (const latest of [undefined, alpha]) {
    test(`stable history in ${name} prevents promotion with latest=${latest}`, (t) => {
      const metadata = packageMetadata();
      metadata[name].versions.push('1.0.0');
      for (const pkg of Object.values(metadata)) {
        pkg['dist-tags'].latest = latest;
      }
      const result = createNpmFixture(t, metadata)();
      assert.equal(result.status, 0, result.stderr);
      assert.deepEqual(result.tagCalls, []);
    });
  }
}

test('a hyphen in stable build metadata is not a prerelease', (t) => {
  const metadata = packageMetadata();
  metadata[react].versions.push('1.0.0+build-42');
  const result = createNpmFixture(t, metadata)();
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.tagCalls, []);
});

for (const [description, invalid] of [
  ['null response', null],
  ['missing version history', { 'dist-tags': { alpha } }],
  ['empty version history', { versions: [], 'dist-tags': { alpha } }],
  ['non-array version history', { versions: alpha, 'dist-tags': { alpha } }],
  ['invalid version', { versions: [alpha, 'broken'], 'dist-tags': { alpha } }],
  [
    'leading-zero major version',
    { versions: [alpha, '01.0.0-alpha.1'], 'dist-tags': { alpha } },
  ],
  [
    'leading-zero prerelease number',
    { versions: [alpha, '1.0.0-alpha.01'], 'dist-tags': { alpha } },
  ],
  [
    'v-prefixed version',
    { versions: [alpha, 'v1.0.0-alpha.1'], 'dist-tags': { alpha } },
  ],
  ['non-string version', { versions: [alpha, null], 'dist-tags': { alpha } }],
  ['missing dist-tags', { versions: [alpha] }],
  ['array dist-tags', { versions: [alpha], 'dist-tags': [] }],
  ['invalid latest', { versions: [alpha], 'dist-tags': { latest: 42, alpha } }],
]) {
  test(`rejects ${description} before changing either package`, (t) => {
    const metadata = packageMetadata();
    metadata[react] = invalid;
    const result = createNpmFixture(t, metadata)();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Invalid npm metadata/);
    assert.deepEqual(result.tagCalls, []);
  });
}

for (const invalidAlpha of [undefined, 42, '1.0.0-alpha.99']) {
  test(`rejects missing or unpublished alpha=${invalidAlpha}`, (t) => {
    const metadata = packageMetadata();
    metadata[react]['dist-tags'].alpha = invalidAlpha;
    const result = createNpmFixture(t, metadata)();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Invalid alpha tag/);
    assert.deepEqual(result.tagCalls, []);
  });
}

test('rejects mismatched alpha tags before changing either package', (t) => {
  const metadata = packageMetadata();
  metadata[react].versions.push('1.0.0-alpha.28');
  metadata[react]['dist-tags'].alpha = '1.0.0-alpha.28';
  const result = createNpmFixture(t, metadata)();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /alpha tags do not match/);
  assert.deepEqual(result.tagCalls, []);
});

test('a failed registry read prevents all tag changes', (t) => {
  const result = createNpmFixture(t)({ NPM_TEST_FAIL_VIEW: react });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /simulated npm view failure/);
  assert.deepEqual(result.tagCalls, []);
});

test('invalid registry JSON prevents all tag changes', (t) => {
  const result = createNpmFixture(t)({ NPM_TEST_INVALID_JSON: react });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /SyntaxError/);
  assert.deepEqual(result.tagCalls, []);
});

test('a failed tag write is reported and a rerun repairs the remaining tag', (t) => {
  const run = createNpmFixture(t);
  const failed = run({ NPM_TEST_FAIL_TAG: react });
  assert.notEqual(failed.status, 0);
  assert.match(failed.stderr, /simulated npm dist-tag failure/);
  assert.equal(failed.metadata[frontend]['dist-tags'].latest, alpha);
  assert.equal(failed.metadata[react]['dist-tags'].latest, '1.0.0-alpha.16');

  const retried = run();
  assert.equal(retried.status, 0, retried.stderr);
  assert.deepEqual(retried.tagCalls, [
    ['dist-tag', 'add', `${react}@${alpha}`, 'latest', registry],
  ]);
  assert.equal(retried.metadata[react]['dist-tags'].latest, alpha);
});
