import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { format } from 'prettier';
import semver from 'semver';

const packages = ['@govtech-bb/frontend', '@govtech-bb/react'];
const files = ['packages/frontend/package.json', 'packages/react/package.json'];

class ReleaseError extends Error {
  _tag = 'ReleaseError';
}

function execute(program, args) {
  return spawnSync(program, args, {
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
  });
}

function command(program, args) {
  const result = execute(program, args);
  if (result.status !== 0) {
    // npm/gh error bodies may contain credentials; report safe command context.
    throw new ReleaseError(
      `Release command ${program} ${args[0]} failed (exit ${result.status}).`,
    );
  }
  return result.stdout.trim();
}

const git = (...args) => command('git', args);

function releaseVersion(version, tags = []) {
  if (
    typeof version !== 'string' ||
    semver.valid(version) !== version ||
    semver.major(version) !== 1
  ) {
    return new ReleaseError(
      'Release version must be canonical 1.x SemVer, without a leading v, leading zeros or build metadata.',
    );
  }
  const tag = `v${version}`;
  const newer = tags.find(
    (value) =>
      value !== tag &&
      value.startsWith('v') &&
      semver.valid(value.slice(1)) &&
      semver.gte(value.slice(1), version),
  );
  if (newer)
    return new ReleaseError(`Release version must be newer than ${newer}.`);
  return {
    version,
    tag,
    npmTag: semver.prerelease(version) ? 'alpha' : 'latest',
  };
}

function registryVersion(name, version) {
  const result = execute('npm', [
    'view',
    `${name}@${version}`,
    'version',
    'dist.integrity',
    '--json',
    '--fetch-retries=0',
    '--fetch-timeout=15000',
  ]);
  let metadata;
  try {
    metadata = JSON.parse(result.stdout);
  } catch {
    return new ReleaseError(
      `Release registry returned invalid metadata for ${name}.`,
    );
  }
  if (result.status !== 0) {
    if (metadata?.error?.code === 'E404') return null;
    return new ReleaseError(
      `Release registry lookup failed for ${name}; absence is unconfirmed.`,
    );
  }
  const integrity = metadata?.['dist.integrity'];
  if (
    metadata?.version !== version ||
    typeof integrity !== 'string' ||
    !/^sha512-[A-Za-z0-9+/]{86}==$/.test(integrity)
  ) {
    return new ReleaseError(
      `Release registry returned invalid metadata for ${name}.`,
    );
  }
  return { version, integrity };
}

function githubRelease(tag) {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository || !/^[\w.-]+\/[\w.-]+$/.test(repository))
    return new ReleaseError('Release lookup requires GITHUB_REPOSITORY.');
  const api = process.env.GITHUB_API_URL || 'https://api.github.com';
  const result = execute('gh', [
    'api',
    '--include',
    `${api.replace(/\/$/, '')}/repos/${repository}/releases/tags/${tag}`,
  ]);
  const status = /^HTTP\/\S+ (\d+)/.exec(result.stdout)?.[1];
  if (status === '404') return 'missing';
  if (status === '200') {
    try {
      const metadata = JSON.parse(result.stdout.split(/\r?\n\r?\n/, 2)[1]);
      if (metadata.tag_name === tag && typeof metadata.draft === 'boolean')
        return metadata.draft ? 'draft' : 'published';
    } catch {
      return new ReleaseError(
        'Release lookup returned invalid GitHub metadata.',
      );
    }
  }
  return new ReleaseError(
    'Release GitHub lookup failed; absence is unconfirmed.',
  );
}

async function notesProblem(release) {
  const generated = command('pnpm', [
    'exec',
    'git-cliff',
    '--tag',
    release.tag,
  ]);
  // Preparation and publication dates can differ; release contents cannot.
  const normalize = (value) =>
    value.replace(/^(## .+) \(\d{4}-\d{2}-\d{2}\)$/gm, '$1').trim();
  if (
    normalize(await format(generated, { parser: 'markdown' })) !==
    normalize(readFileSync('CHANGELOG.md', 'utf8'))
  ) {
    return 'Release changelog is stale. Refresh the release PR before merging, or prepare a replacement after merging.';
  }
}

function prepareRelease(current, manifests) {
  const replacement = process.env.REPLACE_UNRELEASED;
  if (!['true', 'false'].includes(replacement))
    return 'Release preparation requires a valid replace-unreleased input.';
  if (
    git('status', '--porcelain') ||
    git('rev-parse', 'HEAD') !== git('rev-parse', 'origin/main')
  )
    return 'Release preparation requires a clean checkout of origin/main.';
  const tags = git('tag', '--list', 'v*').split('\n');
  const release = releaseVersion(process.env.RELEASE_VERSION, [
    ...tags,
    current.tag,
  ]);
  if (release instanceof ReleaseError) return release.message;
  if (
    tags.includes(release.tag) ||
    !semver.gt(release.version, current.version)
  )
    return 'Release preparation requires a new version newer than the version on main.';
  for (const name of packages) {
    const next = registryVersion(name, release.version);
    if (next instanceof ReleaseError) return next.message;
    if (next)
      return `Release preparation refuses already published ${name}@${release.version}.`;
    const previous = registryVersion(name, current.version);
    if (previous instanceof ReleaseError) return previous.message;
    if (replacement === 'true') {
      if (previous || tags.includes(current.tag))
        return 'Release replacement refused: the current version is tagged or partially published. Finish it first.';
    } else if (!previous)
      return 'Release preparation is blocked until both current packages are published. Only an untagged, wholly unpublished failure can be replaced.';
  }
  const github = githubRelease(current.tag);
  if (github instanceof ReleaseError) return github.message;
  if (github !== (replacement === 'true' ? 'missing' : 'published'))
    return 'Release preparation is blocked by the current GitHub release state. Finish it before preparing another.';
  for (const [index, file] of files.entries()) {
    manifests[index].version = release.version;
    writeFileSync(file, `${JSON.stringify(manifests[index], null, 2)}\n`);
  }
  command('pnpm', [
    'exec',
    'git-cliff',
    '--tag',
    release.tag,
    '--output',
    'CHANGELOG.md',
  ]);
  command('pnpm', ['exec', 'prettier', '--write', ...files, 'CHANGELOG.md']);
}

function distributionTag(name, tag) {
  const output = command('npm', [
    'dist-tag',
    'ls',
    name,
    '--fetch-retries=0',
    '--fetch-timeout=15000',
  ]);
  const entries = output.split('\n').map((line) => line.split(': '));
  if (entries.some(([key, version]) => !key || !semver.valid(version)))
    return new ReleaseError(
      `Release registry returned invalid distribution tags for ${name}.`,
    );
  return entries.find(([key]) => key === tag)?.[1];
}

function verifyPackages(release, directory, published) {
  const artifacts = [];
  for (const [index, name] of packages.entries()) {
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
      return new ReleaseError(
        'Release tarball metadata does not match the release or its frontend dependency.',
      );
    }
    const integrity = `sha512-${createHash('sha512').update(readFileSync(tarball)).digest('base64')}`;
    const existing = published[index];
    if (existing && existing.integrity !== integrity)
      return new ReleaseError(
        `Release integrity mismatch for ${name}. Retrieve the original artifact; never replace published bytes.`,
      );
    const channel = distributionTag(name, release.npmTag);
    if (channel instanceof ReleaseError) return channel;
    if (existing && channel !== release.version)
      return new ReleaseError(
        `Release distribution tag mismatch for ${name}. Reconcile npm first.`,
      );
    if (channel !== undefined && semver.gt(channel, release.version))
      return new ReleaseError(
        'Release publication would move a distribution tag backwards.',
      );
    artifacts.push({ name, tarball, integrity, published: Boolean(existing) });
  }
  return artifacts;
}

async function releaseWorkflow() {
  const [operation, directory, ...extra] = process.argv.slice(2);
  if (
    !['prepare', 'check', 'notes', 'verify', 'publish'].includes(operation) ||
    extra.length ||
    (['verify', 'publish'].includes(operation)
      ? !directory
      : directory !== undefined)
  )
    return 'Unknown release workflow operation.';
  if (process.env.GITHUB_ACTIONS !== 'true')
    return 'Use the Prepare release workflow or re-run Release in GitHub Actions.';
  const manifests = files.map((file) => JSON.parse(readFileSync(file, 'utf8')));
  if (manifests[0].version !== manifests[1].version)
    return 'Release package versions must match.';
  const release = releaseVersion(manifests[0].version);
  if (release instanceof ReleaseError) return release.message;
  if (operation === 'prepare') return prepareRelease(release, manifests);
  if (operation === 'notes') return notesProblem(release);

  const published = packages.map((name) =>
    registryVersion(name, release.version),
  );
  const registryError = published.find(
    (value) => value instanceof ReleaseError,
  );
  if (registryError) return registryError.message;
  if (operation === 'check') {
    const github = githubRelease(release.tag);
    if (github instanceof ReleaseError) return github.message;
    if (github === 'draft')
      return 'Resolve the existing draft GitHub release before retrying.';
    if (github === 'published') {
      if (published.some((value) => !value))
        return 'GitHub release is complete but npm is missing a package. Reconcile it first.';
      console.log(JSON.stringify({ needed: false }));
      return;
    }
    if (git('rev-parse', '--is-shallow-repository') === 'true')
      git('fetch', '--quiet', '--unshallow', '--tags', 'origin');
  }
  const ordered = releaseVersion(
    release.version,
    git('tag', '--list', 'v*').split('\n'),
  );
  if (ordered instanceof ReleaseError) return ordered.message;
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
  // Check out only the workflow's trusted event commit. Recovery uses GitHub's
  // original run, not an output-selected checkout under main's credentials/cache.
  if (git('rev-parse', 'HEAD') !== sha)
    return 'Release source is an earlier commit. Re-run the original Release run; later source fixes require a replacement version.';
  const tagged = git('tag', '--list', release.tag);
  if (tagged && git('rev-parse', `${release.tag}^{commit}`) !== sha)
    return 'Release tag points to a different commit. Never move an existing release tag.';
  if (operation === 'check') {
    const problem = await notesProblem(release);
    if (problem) return problem;
    console.log(
      JSON.stringify({
        needed: true,
        version: release.version,
        npm_tag: release.npmTag,
      }),
    );
    return;
  }
  if (operation === 'publish' && !tagged)
    return 'Release publication requires its immutable Git tag first.';
  const artifacts = verifyPackages(release, directory, published);
  if (artifacts instanceof ReleaseError) return artifacts.message;
  if (operation === 'verify') return;
  for (const artifact of artifacts) {
    if (artifact.published) continue;
    const result = execute('npm', [
      'publish',
      artifact.tarball,
      '--access',
      'public',
      '--tag',
      release.npmTag,
      '--fetch-retries=0',
    ]);
    if (result.status !== 0)
      return `Release publication outcome is unconfirmed for ${artifact.name}. Re-run the original release to reconcile npm; do not replace it.`;
    const verified = registryVersion(artifact.name, release.version);
    if (verified instanceof ReleaseError) return verified.message;
    const channel = distributionTag(artifact.name, release.npmTag);
    if (channel instanceof ReleaseError) return channel.message;
    if (
      verified?.integrity !== artifact.integrity ||
      channel !== release.version
    )
      return `Release publication could not verify ${artifact.name}. Reconcile npm before retrying.`;
  }
}

try {
  const problem = await releaseWorkflow();
  if (problem) {
    console.error(problem);
    process.exitCode = 1;
  }
} catch (error) {
  console.error(
    error instanceof ReleaseError
      ? error.message
      : 'Release input or package metadata could not be read. No further release steps will run.',
  );
  process.exitCode = 1;
}
