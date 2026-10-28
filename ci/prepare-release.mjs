/*
 * Prepares a release as an ordinary pull request: branches from origin/main,
 * bumps both packages to the same version, regenerates CHANGELOG.md and
 * commits. Merging that PR is what publishes (see .github/workflows/release.yml).
 *
 * The workflow can't make this commit itself: the ruleset on main rejects
 * pushes whose checks haven't passed, and a PR opened with GITHUB_TOKEN never
 * runs the required checks.
 *
 * Usage: pnpm release:prepare 1.0.0-alpha.30
 *
 * --replace-unreleased skips the one-release-in-flight check, for when the
 * version on main failed its release for good and the next one replaces it.
 */
import { execFileSync } from 'node:child_process';
import { gitTags, releaseVersionProblem } from './release-version.mjs';

// pnpm and npm are .cmd shims on Windows, which only run through a shell.
// Node deprecates passing args with a shell (DEP0190), so they're joined into
// one command; they're fixed strings or the already checked version, so none
// needs quoting. git doesn't need a shell, and its commit message has spaces.
const exec = (cmd, args, options) =>
  process.platform === 'win32' && cmd !== 'git'
    ? execFileSync([cmd, ...args].join(' '), { ...options, shell: true })
    : execFileSync(cmd, args, options);
const run = (cmd, args) => exec(cmd, args, { stdio: 'inherit' });
const read = (cmd, args) => exec(cmd, args, { encoding: 'utf8' });
const succeeds = (cmd, args) => {
  try {
    exec(cmd, args, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const args = process.argv.slice(2);
const version = args.find((arg) => !arg.startsWith('--'));
const replaceUnreleased = args.includes('--replace-unreleased');
const branch = `release/v${version}`;

if (read('git', ['status', '--porcelain'])) {
  fail('Commit or set aside your changes first.');
}

run('git', ['fetch', '--tags', 'origin', 'main']);
const tags = gitTags();
const problem = releaseVersionProblem(version, tags);
if (problem) {
  fail(`Usage: pnpm release:prepare <version>\n${problem}`);
}
if (tags.includes(`v${version}`)) {
  fail(`v${version} is already released.`);
}
const published = (v) =>
  succeeds('npm', ['view', `@govtech-bb/frontend@${v}`, 'version']);
if (published(version)) {
  fail(`@govtech-bb/frontend@${version} is already on npm.`);
}
// one release in flight at a time: if two release PRs merged close together,
// the Release workflow would only see the later version on main and skip the
// earlier one
const mainVersion = JSON.parse(
  read('git', ['show', 'origin/main:packages/frontend/package.json']),
).version;
if (!replaceUnreleased && !published(mainVersion)) {
  fail(
    `${mainVersion}, the version on main, isn't on npm yet. Let its release finish first.\n` +
      `If its release failed for good, add --replace-unreleased and ${mainVersion} is never published.`,
  );
}
if (
  succeeds('git', [
    'rev-parse',
    '--verify',
    '--quiet',
    `refs/heads/${branch}`,
  ]) ||
  succeeds('git', ['ls-remote', '--exit-code', '--heads', 'origin', branch])
) {
  fail(`${branch} already exists. Delete it or pick another version.`);
}

const startBranch = read('git', ['branch', '--show-current']).trim();
const start = startBranch
  ? [startBranch]
  : ['--detach', read('git', ['rev-parse', 'HEAD']).trim()];
run('git', ['switch', '--no-track', '-c', branch, 'origin/main']);
// Ctrl-C would otherwise kill this script before the catch below cleans up;
// with a listener, the step being run gets the signal and fails instead
process.on('SIGINT', () => {});
try {
  run('pnpm', [
    '--filter',
    './packages/*',
    'exec',
    'npm',
    'pkg',
    'set',
    `version=${version}`,
  ]);
  run('pnpm', [
    'exec',
    'git-cliff',
    '--tag',
    `v${version}`,
    '--output',
    'CHANGELOG.md',
  ]);
  run('git', [
    'add',
    'packages/frontend/package.json',
    'packages/react/package.json',
    'CHANGELOG.md',
  ]);
  // cliff.toml skips chore(release) commits, so this one stays out of the changelog
  run('git', ['commit', '-m', `chore(release): v${version}`]);
} catch {
  // the tree was clean before the switch, so -f only drops this script's edits
  console.error(`\nCouldn't prepare v${version}. Removing ${branch}.`);
  run('git', ['switch', '-f', ...start]);
  run('git', ['branch', '-D', branch]);
  process.exit(1);
}

console.log(`
Next, push the branch and open a pull request:

  git push -u origin ${branch}
  gh pr create --fill

Merging it tags v${version}, publishes both packages to npm and creates the
GitHub release.`);
