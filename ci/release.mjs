import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { format } from 'prettier';
import semver from 'semver';
import { parseReleaseVersion } from './release-version.mjs';
import { RELEASE_PACKAGES, readRegistryVersion } from './release-registry.mjs';
import { readGithubRelease } from './release-github.mjs';

const files = ['packages/frontend/package.json', 'packages/react/package.json'];
const command = (name, args) => {
  try {
    return execFileSync(name, args, {
      encoding: 'utf8',
      stdio: 'pipe',
      maxBuffer: 8 * 1024 * 1024,
    });
  } catch (error) {
    // Provider stderr can contain credentials; retain safe command context instead.
    console.error(
      `Release command failed: ${name} ${args[0]} (exit ${error.status ?? 'unknown'}).`,
    );
    throw error;
  }
};
const git = (...args) => command('git', args).trim();

function readRelease() {
  const versions = files.map(
    (file) => JSON.parse(readFileSync(file, 'utf8')).version,
  );
  if (versions[0] !== versions[1])
    return {
      ok: false,
      error: new Error('Release package versions must match.'),
    };
  return parseReleaseVersion(versions[0], []);
}

async function releaseNotesProblem(release) {
  const generated = command('pnpm', [
    'exec',
    'git-cliff',
    '--tag',
    release.tag,
  ]);
  // Dates may differ between preparation and publication, but all contents must match.
  const normalize = (notes) =>
    notes.replace(/^(## .+) \(\d{4}-\d{2}-\d{2}\)$/gm, '$1').trim();
  const formatted = await format(generated, { parser: 'markdown' });
  if (
    normalize(formatted) !== normalize(readFileSync('CHANGELOG.md', 'utf8'))
  ) {
    return 'Release changelog is stale. Refresh and review the release PR before publication.';
  }
}

function readDistributionTag(name, tag) {
  const output = command('npm', ['dist-tag', 'ls', name, '--fetch-retries=0']);
  const line = output.split('\n').find((value) => value.startsWith(`${tag}:`));
  return line?.slice(tag.length + 1).trim();
}

async function runRelease() {
  const [operation, directory, ...extra] = process.argv.slice(2);
  if (
    !['check', 'notes', 'pack', 'verify', 'publish'].includes(operation) ||
    extra.length ||
    (['pack', 'verify', 'publish'].includes(operation)
      ? !directory
      : directory !== undefined)
  ) {
    return 'Unknown release workflow operation.';
  }
  if (operation !== 'notes' && process.env.GITHUB_ACTIONS !== 'true') {
    return 'Releases must run through GitHub Actions, not a local publication command.';
  }
  const parsed = readRelease();
  if (!parsed.ok) return parsed.error.message;
  const release = parsed.value;
  if (operation === 'notes') return releaseNotesProblem(release);

  const published = [];
  for (const name of RELEASE_PACKAGES) {
    const result = await readRegistryVersion(name, release.version);
    if (!result.ok) return result.error.message;
    published.push(result.value);
  }
  if (operation === 'check') {
    const github = readGithubRelease(release.tag, {
      repository: process.env.GITHUB_REPOSITORY,
      apiUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
    });
    if (!github.ok) return github.error.message;
    if (github.value === 'draft')
      return 'Resolve the existing draft GitHub release before retrying publication.';
    if (github.value === 'published') {
      if (published.some((item) => !item))
        return 'GitHub release is complete but npm is missing a package. Reconcile this release first.';
      console.log(JSON.stringify({ needed: false }));
      return;
    }
    if (git('rev-parse', '--is-shallow-repository') === 'true') {
      git('fetch', '--quiet', '--unshallow', '--tags', 'origin');
    }
  }
  const ordered = parseReleaseVersion(
    release.version,
    git('tag', '--list', 'v*').split('\n'),
  );
  if (!ordered.ok) return ordered.error.message;
  const sha = git(
    'log',
    '--first-parent',
    '--diff-merges=first-parent',
    '-1',
    '-s',
    '--format=%H',
    '-G"version":',
    '--',
    ...files,
  );
  const tagged = git('tag', '--list', release.tag);
  if (tagged && git('rev-parse', `${release.tag}^{commit}`) !== sha) {
    return 'Release tag points to a different commit. Do not move an existing release tag.';
  }
  if (operation === 'check') {
    console.log(
      JSON.stringify({
        needed: true,
        version: release.version,
        npm_tag: release.npmTag,
        sha,
      }),
    );
    return;
  }
  if (git('rev-parse', 'HEAD') !== sha)
    return 'Release packaging and publication must use the commit that set the version.';
  if (operation === 'pack') {
    const problem = await releaseNotesProblem(release);
    if (problem) return problem;
    mkdirSync(directory, { recursive: true });
    for (const name of RELEASE_PACKAGES) {
      command('pnpm', [
        '--filter',
        name,
        'pack',
        '--pack-destination',
        resolve(directory),
      ]);
    }
    return;
  }

  if (operation === 'publish' && !tagged)
    return 'Release publication requires its immutable Git tag first.';
  const packages = [];
  // Validate both artifacts and both registry states before the first write.
  for (const [index, name] of RELEASE_PACKAGES.entries()) {
    const tarball = resolve(
      directory,
      `${name.slice(1).replace('/', '-')}-${release.version}.tgz`,
    );
    const manifest = JSON.parse(
      command('tar', ['-xOf', tarball, 'package/package.json']),
    );
    if (
      manifest.name !== name ||
      manifest.version !== release.version ||
      (name === '@govtech-bb/react' &&
        manifest.dependencies?.['@govtech-bb/frontend'] !==
          `^${release.version}`)
    ) {
      return 'Release tarball metadata does not match the release or its frontend dependency.';
    }
    const integrity = `sha512-${createHash('sha512').update(readFileSync(tarball)).digest('base64')}`;
    const existing = published[index];
    if (existing && existing.integrity !== integrity)
      return `Release integrity mismatch for ${name}. Retrieve the original artifact; never republish different bytes.`;
    const channel = readDistributionTag(name, release.npmTag);
    if (existing && channel !== release.version)
      return `Release distribution tag mismatch for ${name}. Reconcile npm before completing the release.`;
    if (
      channel !== undefined &&
      (!semver.valid(channel) || semver.gt(channel, release.version))
    ) {
      return 'Release publication would move a distribution tag backwards. Reconcile the newer release first.';
    }
    packages.push({ name, tarball, integrity, published: Boolean(existing) });
  }
  if (operation === 'verify') return;
  for (const pkg of packages) {
    if (pkg.published) continue;
    // Git reserves the source before publishing. npm's unique name/version and
    // integrity permit reconciliation after a successful upload loses its response.
    try {
      command('npm', [
        'publish',
        pkg.tarball,
        '--access',
        'public',
        '--tag',
        release.npmTag,
        '--fetch-retries=0',
      ]);
    } catch {
      return `Release publication outcome is unconfirmed for ${pkg.name}. Re-run the original release to reconcile npm; do not replace it.`;
    }
    const verified = await readRegistryVersion(pkg.name, release.version);
    if (!verified.ok) return verified.error.message;
    if (
      verified.value?.integrity !== pkg.integrity ||
      readDistributionTag(pkg.name, release.npmTag) !== release.version
    ) {
      return `Release publication could not verify ${pkg.name}. Reconcile npm before retrying.`;
    }
  }
}

try {
  const problem = await runRelease();
  if (problem) {
    console.error(problem);
    process.exitCode = 1;
  }
} catch {
  console.error(
    'Release workflow stopped. Inspect the failed command or package metadata and reconcile remote state before retrying.',
  );
  process.exitCode = 1;
}
