import { execFileSync } from 'node:child_process';
import semver from 'semver';

const packageNames = ['@govtech-bb/frontend', '@govtech-bb/react'];
const registry = '--registry=https://registry.npmjs.org';

const packages = packageNames.map((name) => {
  const metadata = JSON.parse(
    execFileSync(
      'npm',
      ['view', name, 'versions', 'dist-tags', '--json', registry],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] },
    ),
  );
  const versions = metadata?.versions;
  const tags = metadata?.['dist-tags'];
  if (
    !Array.isArray(versions) ||
    versions.length === 0 ||
    !versions.every(
      (version) =>
        typeof version === 'string' &&
        semver.valid(version) === version.split('+')[0],
    ) ||
    !tags ||
    typeof tags !== 'object' ||
    Array.isArray(tags) ||
    (tags.latest !== undefined && !versions.includes(tags.latest))
  ) {
    throw new Error(`Invalid npm metadata for ${name}`);
  }
  return { name, versions, tags };
});

// A retagged or missing latest must not hide an earlier stable release.
if (
  packages.some(({ versions }) =>
    versions.some((version) => semver.prerelease(version) === null),
  )
) {
  console.log('Stable release already published; leaving latest unchanged.');
  process.exit(0);
}

for (const { name, versions, tags } of packages) {
  if (
    !versions.includes(tags.alpha) ||
    semver.prerelease(tags.alpha) === null
  ) {
    throw new Error(`Invalid alpha tag for ${name}: ${tags.alpha}`);
  }
}
const alpha = packages[0].tags.alpha;
if (packages[1].tags.alpha !== alpha) {
  throw new Error('npm alpha tags do not match; refusing to update latest');
}

for (const { name, tags } of packages) {
  if (tags.latest === alpha) continue;
  execFileSync(
    'npm',
    ['dist-tag', 'add', `${name}@${alpha}`, 'latest', registry],
    { stdio: 'inherit' },
  );
}
console.log(`npm latest tags match alpha (${alpha}) for both packages.`);
