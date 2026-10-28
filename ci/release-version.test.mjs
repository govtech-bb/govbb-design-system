#!/usr/bin/env node
/**
 * Tests for release-version.mjs. Each rule is asserted in both directions: a
 * version it should accept and one it should refuse.
 *
 *   node ci/release-version.test.mjs
 */
import {
  compareVersions,
  npmTag,
  releaseVersionProblem,
} from './release-version.mjs';

let failures = 0;

const expect = (name, actual, expected) => {
  const passed = actual === expected;
  console.log(`  ${passed ? 'PASS' : 'FAIL'}  ${name}`);
  if (!passed) {
    console.log(`        expected ${expected}, got ${actual}`);
    failures++;
  }
};

const tags = ['v1.0.0-alpha.9', 'v1.0.0-alpha.29', 'v0.3.0'];
const accepts = (version, existing = tags) =>
  releaseVersionProblem(version, existing) === null;

expect('accepts the next alpha', accepts('1.0.0-alpha.30'), true);
expect('accepts the first stable 1.0.0', accepts('1.0.0'), true);
expect('accepts a version with build metadata', accepts('1.2.3+build.5'), true);
expect(
  'accepts any 1.x when nothing is tagged',
  accepts('1.0.0-alpha.1', []),
  true,
);
expect('refuses 2.x', accepts('2.0.0'), false);
expect('refuses a leading v', accepts('v1.0.0-alpha.30'), false);
expect('refuses a missing version', accepts(undefined), false);
expect('refuses a leading zero in a number', accepts('1.01.0'), false);
expect(
  'refuses a leading zero in a numeric prerelease identifier',
  accepts('1.0.0-alpha.030'),
  false,
);
expect(
  'accepts a zero and alphanumerics starting with a digit',
  accepts('1.0.0-alpha.0.0a', []),
  true,
);
expect(
  'refuses an already tagged version as a downgrade',
  accepts('1.0.0-alpha.28'),
  false,
);
expect(
  'refuses an untagged lower version',
  accepts('1.0.0-alpha.10', ['v1.0.0-alpha.29']),
  false,
);
expect(
  'ignores the version’s own tag, so a half-finished release can be finished',
  accepts('1.0.0-alpha.29'),
  true,
);
expect(
  'still refuses its own version when a newer one is tagged',
  accepts('1.0.0-alpha.29', [...tags, 'v1.0.0-alpha.30']),
  false,
);

// numeric prerelease identifiers compare as numbers, not strings
expect(
  'alpha.10 is newer than alpha.9',
  compareVersions('1.0.0-alpha.10', '1.0.0-alpha.9') > 0,
  true,
);
expect(
  'a release is newer than its prerelease',
  compareVersions('1.0.0', '1.0.0-alpha.30') > 0,
  true,
);
expect(
  'alpha is older than beta',
  compareVersions('1.0.0-alpha.30', '1.0.0-beta.1') < 0,
  true,
);
expect(
  'a longer prerelease is newer',
  compareVersions('1.0.0-alpha.1.1', '1.0.0-alpha.1') > 0,
  true,
);
expect(
  'equal numbers fall through to the prerelease',
  compareVersions('1.1.0-alpha.1', '1.1.0-alpha.9') < 0,
  true,
);
expect('build metadata is ignored', compareVersions('1.0.0+a', '1.0.0+b'), 0);

expect('a prerelease publishes to alpha', npmTag('1.0.0-alpha.30'), 'alpha');
expect('a release publishes to latest', npmTag('1.0.0'), 'latest');
expect(
  'a hyphen in build metadata is not a prerelease',
  npmTag('1.0.0+build-5'),
  'latest',
);

if (failures) {
  console.error(`\n${failures} failing`);
  process.exit(1);
}
