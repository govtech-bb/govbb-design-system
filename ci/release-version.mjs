/*
 * The release version rules, shared by `pnpm release:prepare` and the Release
 * workflow so the two can't drift apart: a version must be valid 1.x semver
 * and newer than every version already tagged, and a prerelease publishes to
 * npm under `alpha` rather than `latest`.
 *
 * As a command it checks a version against the repo's tags and prints its npm
 * dist-tag, or explains the problem and exits 1:
 *
 *   node ci/release-version.mjs 1.0.0-alpha.30
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RELEASE_VERSION =
  /^1\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const SEMVER =
  /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

export const isReleaseVersion = (version) => RELEASE_VERSION.test(version);

export const npmTag = (version) =>
  version.split('+')[0].includes('-') ? 'alpha' : 'latest';

const compareIdentifiers = (a, b) => {
  const aNumeric = /^\d+$/.test(a);
  const bNumeric = /^\d+$/.test(b);
  if (aNumeric && bNumeric) return Number(a) - Number(b);
  // numeric identifiers sort before alphanumeric ones
  if (aNumeric !== bNumeric) return aNumeric ? -1 : 1;
  return a < b ? -1 : a > b ? 1 : 0;
};

// semver precedence; build metadata is ignored
export const compareVersions = (a, b) => {
  const [, ...x] = a.match(SEMVER);
  const [, ...y] = b.match(SEMVER);
  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) return Number(x[i]) - Number(y[i]);
  }
  if (!x[3] || !y[3]) return (x[3] ? -1 : 0) + (y[3] ? 1 : 0);
  const xs = x[3].split('.');
  const ys = y[3].split('.');
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    const order = compareIdentifiers(xs[i], ys[i]);
    if (order) return order;
  }
  return xs.length - ys.length;
};

/*
 * Why `version` can't be released, or null if it can. `tags` are the repo's
 * tags; the version's own tag is ignored so a release that failed after
 * tagging can still be finished.
 */
export const releaseVersionProblem = (version, tags) => {
  if (!isReleaseVersion(version ?? '')) {
    return `The version must be a valid 1.x semver without a leading v, got ${version}.`;
  }
  const newest = tags
    .filter((tag) => tag !== `v${version}` && SEMVER.test(tag.slice(1)))
    .map((tag) => tag.slice(1))
    .sort(compareVersions)
    .at(-1);
  if (newest && compareVersions(version, newest) <= 0) {
    return `${version} isn't newer than v${newest}, the newest tag.`;
  }
  return null;
};

export const gitTags = () =>
  execFileSync('git', ['tag', '--list', 'v*'], { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const version = process.argv[2];
  const problem = releaseVersionProblem(version, gitTags());
  if (problem) {
    console.error(problem);
    process.exit(1);
  }
  console.log(npmTag(version));
}
