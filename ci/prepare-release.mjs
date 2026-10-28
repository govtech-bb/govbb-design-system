import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { parseReleaseVersion } from './release-version.mjs';
import { RELEASE_PACKAGES, readRegistryVersion } from './release-registry.mjs';
import { readGithubRelease } from './release-github.mjs';

const files = ['packages/frontend/package.json', 'packages/react/package.json'];
const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8', stdio: 'pipe' }).trim();

async function prepareRelease() {
  const version = process.env.RELEASE_VERSION;
  const replacement = process.env.REPLACE_UNRELEASED;
  if (
    process.env.GITHUB_ACTIONS !== 'true' ||
    !['true', 'false'].includes(replacement)
  ) {
    return 'Release preparation must run through the Prepare release workflow.';
  }
  if (
    git('status', '--porcelain') ||
    git('rev-parse', 'HEAD') !== git('rev-parse', 'origin/main')
  ) {
    return 'Release preparation requires a clean checkout of origin/main.';
  }
  const tags = git('tag', '--list', 'v*').split('\n');
  const parsed = parseReleaseVersion(version, tags);
  if (!parsed.ok) return parsed.error.message;
  const release = parsed.value;
  if (tags.includes(release.tag))
    return 'Release preparation refuses an already tagged version.';

  const manifests = files.map((file) => JSON.parse(readFileSync(file, 'utf8')));
  const current = parseReleaseVersion(manifests[0].version, []);
  if (!current.ok || manifests[1].version !== current.value.version) {
    return 'Release preparation requires matching valid package versions on main.';
  }
  const advance = parseReleaseVersion(release.version, [current.value.tag]);
  if (!advance.ok || release.version === current.value.version) {
    return 'Release preparation requires a version newer than the version on main.';
  }
  for (const name of RELEASE_PACKAGES) {
    const next = await readRegistryVersion(name, release.version);
    if (!next.ok) return next.error.message;
    if (next.value)
      return `Release preparation refuses ${name}@${release.version}: it is already published.`;
    const previous = await readRegistryVersion(name, current.value.version);
    if (!previous.ok) return previous.error.message;
    if (replacement === 'true') {
      // A tag reserves the source before publication. Do not discard that
      // recovery identity after an interrupted or partially completed publish.
      if (previous.value || tags.includes(current.value.tag)) {
        return 'Release replacement refused: the previous version is tagged or partially published. Finish it first.';
      }
    } else if (!previous.value) {
      return 'Release preparation is blocked until both current packages are published. Replace an unreleased version only after an untagged, wholly unpublished failure.';
    }
  }

  const github = readGithubRelease(current.value.tag, {
    repository: process.env.GITHUB_REPOSITORY,
    apiUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
  });
  if (!github.ok) return github.error.message;
  if (replacement === 'false' && github.value !== 'published')
    return 'Finish the current GitHub release before preparing another version.';
  if (replacement === 'true' && github.value !== 'missing')
    return 'Release replacement refused: GitHub already has release metadata for this version.';

  for (const [index, file] of files.entries()) {
    manifests[index].version = release.version;
    writeFileSync(file, `${JSON.stringify(manifests[index], null, 2)}\n`);
  }
  // Only the following create-pull-request step commits. A failed preparation
  // leaves disposable runner files, never a half-created maintainer branch.
  execFileSync(
    'pnpm',
    ['exec', 'git-cliff', '--tag', release.tag, '--output', 'CHANGELOG.md'],
    { stdio: 'inherit' },
  );
  execFileSync(
    'pnpm',
    ['exec', 'prettier', '--write', ...files, 'CHANGELOG.md'],
    { stdio: 'inherit' },
  );
}

try {
  const problem = await prepareRelease();
  if (problem) {
    console.error(problem);
    process.exitCode = 1;
  }
} catch {
  console.error(
    'Release preparation failed. No release PR or package was published; inspect the failed step and retry Prepare release.',
  );
  process.exitCode = 1;
}
