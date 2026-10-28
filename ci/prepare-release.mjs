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
 */
import { execFileSync } from 'node:child_process';

const version = process.argv[2];
if (
  !/^1\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/.test(
    version ?? '',
  )
) {
  console.error('Usage: pnpm release:prepare <version>');
  console.error('The version must be a valid 1.x semver without a leading v.');
  process.exit(1);
}

const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' });
const read = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8' });

if (read('git', ['status', '--porcelain'])) {
  console.error('Commit or set aside your changes first.');
  process.exit(1);
}

const branch = `release/v${version}`;
run('git', ['fetch', '--tags', 'origin', 'main']);
if (read('git', ['tag', '--list', `v${version}`])) {
  console.error(`v${version} is already released.`);
  process.exit(1);
}
run('git', ['switch', '--no-track', '-c', branch, 'origin/main']);
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

console.log(`
Next, push the branch and open a pull request:

  git push -u origin ${branch}
  gh pr create --fill

Merging it tags v${version}, publishes both packages to npm and creates the
GitHub release.`);
