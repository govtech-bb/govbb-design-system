import assert from 'node:assert/strict';
import { test } from 'node:test';
import fc from 'fast-check';
import { parseReleaseVersion } from './release-version.mjs';

const tags = ['v1.0.0-alpha.9', 'v1.0.0-alpha.29', 'v0.3.0'];

test('release parser rejects invalid or ambiguous npm identities', () => {
  for (const input of [
    undefined,
    null,
    {},
    1,
    '',
    'v1.0.0',
    ' 1.0.0',
    '2.0.0',
    '1.01.0',
    '1.0.01',
    '1.0.0-alpha.030',
    '1.0.0+build.5',
    '1.0.0\n',
    '1.9007199254740992.0',
    '1.0.0; echo injected',
  ]) {
    assert.equal(parseReleaseVersion(input, tags).ok, false, String(input));
  }
});

test('release parser preserves retry identity and channel policy', () => {
  for (const [version, npmTag] of [
    ['1.0.0-alpha.30', 'alpha'],
    ['1.0.0-beta.1', 'alpha'],
    ['1.0.0', 'latest'],
  ]) {
    const result = parseReleaseVersion(version, tags);
    assert.equal(result.ok, true);
    assert.equal(result.value.npmTag, npmTag);
    assert.equal(result.value.tag, `v${version}`);
    assert.ok(Object.isFrozen(result.value));
    assert.equal(
      parseReleaseVersion(version, [...tags, `v${version}`]).ok,
      true,
    );
  }
  assert.equal(parseReleaseVersion('1.0.0-alpha.28', tags).ok, false);
  assert.equal(
    parseReleaseVersion('1.0.0-alpha.29', [...tags, 'v1.0.0-alpha.30']).ok,
    false,
  );
});

test('numeric prerelease ordering and retry identity hold for generated versions', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 1000 }),
      fc.integer({ min: 0, max: 1000 }),
      fc.integer({ min: 0, max: 1000000 }),
      (minor, patch, sequence) => {
        const previous = `1.${minor}.${patch}-alpha.${sequence}`;
        const next = `1.${minor}.${patch}-alpha.${sequence + 1}`;
        const accepted = parseReleaseVersion(next, [`v${previous}`]);
        assert.equal(accepted.ok, true);
        assert.equal(
          parseReleaseVersion(previous, [accepted.value.tag]).ok,
          false,
        );
        assert.equal(
          parseReleaseVersion(next, [`v${previous}`, accepted.value.tag]).ok,
          true,
        );
        // Corruption is independent of the parser so weakening it breaks this property.
        assert.equal(
          parseReleaseVersion(`1.${minor}.${patch}-alpha.0${sequence + 1}`, [])
            .ok,
          false,
        );
      },
    ),
  );
});
